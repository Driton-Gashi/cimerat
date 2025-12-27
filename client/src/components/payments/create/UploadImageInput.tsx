import React, { useEffect, useRef } from 'react';

type P = {
   selectedImage: File | null;
   setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
   previewUrl: string | null;
   setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
};

const UploadImageInput = ({ previewUrl, selectedImage, setPreviewUrl, setSelectedImage }: P) => {
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const openFilePicker = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
         alert('Please select an image file.');
         return;
      }

      setSelectedImage(file);
   };

   useEffect(() => {
      if (!selectedImage) {
         setPreviewUrl(null);
         return;
      }

      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);

      // Cleanup: revoke this URL when selectedImage changes or component unmounts.
      return () => {
         URL.revokeObjectURL(url);
      };
   }, [selectedImage]);

   const removeSelectedImage = () => {
      setSelectedImage(null);

      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };

   return (
      <div className="flex flex-column gap-3">
         <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
         />

         {selectedImage && previewUrl ? (
            <div className="flex flex-column flex-align-center">
               <img
                  alt="Selected preview"
                  width={100}
                  src={previewUrl}
                  style={{ objectFit: 'cover' }}
               />

               <button className="link-button" type="button" onClick={removeSelectedImage}>
                  Remove
               </button>
            </div>
         ) : (
            <>
               <img
                  src="/paymentPicture.png"
                  alt="Payment"
                  style={{ cursor: 'pointer' }}
                  onClick={openFilePicker}
               />

               <button className="link-button" type="button" onClick={openFilePicker}>
                  Upload Photo
               </button>
            </>
         )}
      </div>
   );
};

export default UploadImageInput;
