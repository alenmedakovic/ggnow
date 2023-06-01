import React, { useState, useEffect } from 'react';
import { collection, doc, addDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { auth, firestore, storage } from '../firebase'; // Import the firestore and storage objects from your Firebase configuration
import { FaTimes } from 'react-icons/fa';
import "./createthread.css";


const CreateThread = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          console.log("your user id:", uid);
          // ...
        } else {
          navigate("/login");
          // ...
        }
      });
    })


  const handleMediaChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setMedia(selectedFile);
      setMediaPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleDescriptionChange = (event) => {
    const inputValue = event.target.value;
    const limitedValue = inputValue.slice(0, 250);

    setDescription(limitedValue);
  }

  const handleTitleChange = (event) => {
    const titleInputValue = event.target.value;
    const titleLimitedValue = titleInputValue.slice(0, 25);

    setTitle(titleLimitedValue);
  }

  const createThread = async () => {
    try {
      const threadRef = await addDoc(collection(firestore, 'threads'), {
        title,
        description,
        uid: auth.currentUser.uid,
        createdAt: new Date(),
        media: null,
      });

      const threadId = threadRef.id;

      if (media) {
        // Upload media file to Firebase Storage with thread ID as the filename
        const storageRef = ref(storage, `media/${threadId}/${media.name}`);
        await uploadBytes(storageRef, media);

        // Get the download URL of the uploaded media file
        const mediaURL = await getDownloadURL(storageRef);

        // Update the thread with the media URL
        await setDoc(doc(firestore, 'threads', threadId), { media: mediaURL }, { merge: true });
      }

      // Reset form fields after successful thread creation
      setTitle('');
      setDescription('');
      setMedia(null);
      setMediaPreview('');

      console.log('Thread created successfully!');
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  };

  const clearMedia = () => {
    setMedia(null);
    setMediaPreview("");
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-col p-4">
          <input
            className="w-1/3 mb-4 px-2 py-2 bg-transparent border-b-2 border-gray-300 focus:outline-none"
            type="text"
            placeholder="Title"
            value={title}
            onChange={handleTitleChange}
          />
          <textarea
            className="w-2/4 h-40 px-2 py-2 resize-none bg-transparent focus:outline-none"
            placeholder="Description"
            value={description}
            onChange={handleDescriptionChange}
          ></textarea>
        </div>
        <div className="flex items-end justify-start">
          <input
            className="w-1/2 p-2 bg-transparent focus:outline-none ml-2"
            type="file"
            accept="image/*, video/*"
            onChange={handleMediaChange}
          />
          <button
            className="create__button bg-red-500 text-white py-2 px-8 rounded mb-2"
            onClick={createThread}
          >
            Create Thread
          </button>
        </div>
      </div>
      <div className="flex absolute w-60 ml-80 py-4">
        {mediaPreview && (
          <div className="max-w-1/3 max-h-40 border-gray-300 border-2">
            {media.type.startsWith('image') ? (
              <img className="h-full w-full object-cover" src={mediaPreview} alt="Media Preview" />
            ) : (
              <video className="h-full w-full object-cover" controls>
                <source src={mediaPreview} type={media.type} />
                Your browser does not support the video tag.
              </video>
            )}
            <button
            className="absolute top-0 left-60 text-gray-500"
            onClick={clearMedia}
            >
              <FaTimes />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateThread;
