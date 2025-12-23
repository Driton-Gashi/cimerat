import React, { useEffect, useRef, useState } from 'react';

const UploadImageInput = () => {
   const [selectedImage, setSelectedImage] = useState<File | null>(null);

   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const openFilePicker = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Safety check: ensure it's an image (because accept is not a guarantee)
      if (!file.type.startsWith('image/')) {
         alert('Please select an image file.');
         return;
      }

      setSelectedImage(file);
   };

   /**
    * Whenever `selectedImage` changes, we create a new preview URL.
    * We also revoke (cleanup) the old URL to prevent memory leaks.
    */
   useEffect(() => {
      // If no image is selected, clear the preview URL.
      if (!selectedImage) {
         setPreviewUrl(null);
         return;
      }

      // Create a browser URL for previewing the local file.
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);

      // Cleanup: revoke this URL when selectedImage changes or component unmounts.
      return () => {
         URL.revokeObjectURL(url);
      };
   }, [selectedImage]);

   /**
    * Remove the selected image and reset the input.
    * Resetting the input is important so the user can re-select the same file again.
    */
   const removeSelectedImage = () => {
      setSelectedImage(null);

      // Reset the actual file input value (so re-picking the same file triggers onChange)
      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   /**
    * Example "submit" action.
    * In real apps, you'd send the file to your API using FormData, etc.
    */
   const handleSubmit = () => {
      if (!selectedImage) {
         console.log('No image selected.');
         return;
      }

      console.log('Selected file:', selectedImage);
      console.log('Preview URL:', previewUrl);
   };

   return (
      <div className="flex flex-column gap-3">
         {/* Hidden file input (opened via button/image click) */}
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
         />

         {selectedImage && previewUrl ? (
            // State: image selected -> show preview + remove button
            <div className="flex flex-column align-items-center gap-2">
               <img
                  alt="Selected preview"
                  width={100}
                  src={previewUrl}
                  // optional: make preview look nicer if it's not square
                  style={{ objectFit: 'cover' }}
               />

               <button type="button" onClick={removeSelectedImage}>
                  Remove
               </button>
            </div>
         ) : (
            // State: no image -> show default image + upload button
            <>
               {/* Clicking the image opens the file picker */}
               <img
                  src="/paymentPicture.png"
                  alt="Payment"
                  style={{ cursor: 'pointer' }}
                  onClick={openFilePicker}
               />

               {/* Use a real button instead of <a> for actions */}
               <button type="button" onClick={openFilePicker}>
                  Upload Photo
               </button>
            </>
         )}

         {/* Example action button */}
         <button type="button" onClick={handleSubmit}>
            blah blah
         </button>
      </div>
   );
};

export default UploadImageInput;
