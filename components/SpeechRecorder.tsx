"use client"
import React, { useRef } from 'react'
import Recorder, { mimeType } from './Recorder'
import { useFormState } from 'react-dom';
import transcript from '@/actions/transcript';

const initialState = {
  sender: "",
  response: "",
}

function SpeechRecorder({ onTranscriptReceived }: { onTranscriptReceived?: (text: string) => void }) {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const submitButtonRef = useRef<HTMLButtonElement | null>(null);
    const [state, formAction] = useFormState(transcript, initialState);

    // const uploadAudio = (blob: Blob) => {
    //     // e.preventDefault();
    //     // const url = URL.createObjectURL(blob);
    //     const file = new File([blob], "audio.mp3", { type: "audio/mp3" });
      
    //     console.log("File: ", file)
    //     // set the file as the value of the hidden file input field\
    //     if (fileRef.current) {
    //       const dataTransfer = new DataTransfer();
    //       dataTransfer.items.add(file);
    //       fileRef.current.files = dataTransfer.files;
    //     }
    
    //     // simulate a click & submit the form
    //     if (submitButtonRef.current) {
    //       console.log("clicked")
    //       submitButtonRef.current.click();
    //     }
    //   }
    const uploadAudio = async (blob: Blob) => {
      const file = new File([blob], "audio.mp3", { type: "audio/mp3" });
      
      if (formRef.current) {
          const formData = new FormData();
          formData.append('audio', file);
          
          try {
              const result = await transcript(null, formData);
              // Handle the result here
              // console.log('Transcript result:', result);

              // If a callback was provided, send the transcribed text back to the parent
            if (onTranscriptReceived && result?.response) {
              onTranscriptReceived(result.response);
            }
          } catch (error) {
              console.error('Error uploading audio:', error);
          }
      }
  };

  return (
    <div>
        <form
          ref={formRef}
         action={formAction}>
        {/* Hidden files */}
            <input type="file" name="audio" hidden ref={fileRef}/>
            <button type="submit" hidden ref={submitButtonRef} />

            <div>
                {/* Recorder */}
                <Recorder uploadAudio={uploadAudio}/>
            </div>
        </form>
    </div>
  )
}

export default SpeechRecorder