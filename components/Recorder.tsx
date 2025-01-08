"use client"
import { Mic } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom';
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { toBlobURL } from "@ffmpeg/util"


export const mimeType = "audio/webm";
function Recorder({uploadAudio}: { uploadAudio: (blob: Blob) => void }) {
    const [permission, setPermission] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    // const MediaRecorder = useRef<MediaRecorder | null>(null)
    const { pending } = useFormStatus();
    const [ recordingStatus, setRecordingStatus ] = useState("inactive");
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

    useEffect(() => {
        getMicrophonePermission();
    },[]);

    const getMicrophonePermission = async() => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video:false
                });
                setPermission(true);
                setStream(streamData);

            } catch (err: any) {
                alert(err.message)
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    }

    const startRecording = async() => {
        
        if(stream === null || pending) return;
        
        // console.log("Recording");
        setRecordingStatus("recording");
        

        // create a new media recorder instance for the stream
        const media = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        let localAudioChunks:Blob [] = [];
        
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0)return;
            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);
    }

    const stopRecording = async () => {
        if (mediaRecorder.current === null || pending) return;
        
        // console.log("Stopping recording");
        setRecordingStatus("inactive");
        mediaRecorder.current.stop();
        
        mediaRecorder.current.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            
            try {
                // Create FFmpeg instance
                const ffmpeg = new FFmpeg();
                
                // Load FFmpeg
                const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
                await ffmpeg.load({
                    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
                });
                
                // Convert Blob to ArrayBuffer
                const arrayBuffer = await audioBlob.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                
                // Write input file
                await ffmpeg.writeFile('input.webm', uint8Array);
                
                // Run FFmpeg command
                await ffmpeg.exec(['-i', 'input.webm', '-c:a', 'libmp3lame', 'output.mp3']);
                
                // Read the output file
                const data = await ffmpeg.readFile('output.mp3');
                const mp3Blob = new Blob([data], { type: 'audio/mp3' });
                
                // Upload the converted audio
                await uploadAudio(mp3Blob);
                // console.log("Audio: ", mp3Blob);
                
                // Clean up
                await ffmpeg.deleteFile('input.webm');
                await ffmpeg.deleteFile('output.mp3');
                
            } catch (error) {
                console.error('FFmpeg processing failed:', error);
            }
            
            setAudioChunks([]);
        };
    };

  return (
    <div className='relative z-50'>
        {!permission && (
            <Mic onClick={getMicrophonePermission} className='text-red-400 text-muted font-medium p-2 text-lg bg-blue-300'/>
        )}
        {pending && (
            <Mic 
                className='font-bold m-2 text-3xl grayscale'
            />
        )}

        {permission && recordingStatus === "inactive" && !pending && (
            <Mic 
                onClick={startRecording}
                className='font-medium m-2 text-3xl cursor-pointer text-indigo-700 hover:scale-125 duration-150 transition-all ease-in-out'
            />
        )}
        
        {recordingStatus === "recording" && (
            <div className='bg-red-600 w-10 rounded-lg h-10 flex items-center'>
                <Mic
                    onClick={stopRecording}
                    className='font-medium m-2 text-3xl cursor-pointer text-white animate-bounce hover:scale-125 duration-700 transition-all ease-in-out'
                    // disabled={true}
                />
            </div>
        )}
    </div>
  )
}

export default Recorder