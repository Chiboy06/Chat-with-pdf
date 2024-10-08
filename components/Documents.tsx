import { adminDb } from "@/firebaseAdmin";
import PlaceholderDocument from "./PlaceholderDocument"
import { auth } from "@clerk/nextjs/server";
import DocumentFile from "./Document";
// import { useMediaQuery } from 'react-responsive'


async function Documents() {
  auth().protect();
  // const Mobile = useMediaQuery({ query: '(max-width: 1224px)' })

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not found");
  }

//   const ref = await adminDb
//   .collection("users")
//   .doc(userId!)
//   .collection("files")
//   .doc(id)
//   .get();

// const url = ref.data()?.downloadUrl;

  const documentsSnapshot = await adminDb
    .collection("users")
    .doc(userId)
    .collection("files")
    .get();
  return (
    <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
        {/* Map through the documents */}
          { documentsSnapshot.docs.map((doc) => {
            const { name, downloadUrl, size } = doc.data();

            return (
              <DocumentFile
                key={doc.id}
                id={doc.id}
                name={name}
                size={size}
                downloadUrl={downloadUrl}
              />
            );
          })}
        {/* Placeholder Document */}
      <PlaceholderDocument/>
        
    </div>
  )
}

export default Documents