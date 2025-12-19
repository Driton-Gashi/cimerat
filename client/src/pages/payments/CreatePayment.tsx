import './payments.css';
import PaymentPicture from '../../../public/paymentPicture.png';

const CreatePayment = () => {
   return (
      <div className="create-payment-main">
         <h1>Create a Payment</h1>
         <div className="create-payment-wrapper">
            <div className="upload-payment-picture">
               <img src={PaymentPicture} alt="" />
               <a href="#">Upload Photo</a>
            </div>
            <div className="payment-form-container">
               <div className="payment-form-grid">
                  <div className="payment-form-group">
                     <label>Category</label>
                     <select>
                        <option>Bills</option>
                        <option>Personal</option>
                        <option>Product</option>
                     </select>
                  </div>

                  <div className="payment-form-group">
                     <label>Payment Name</label>
                     <input type="text" placeholder="Enter the payment name" />
                  </div>

                  <div className="payment-form-group">
                     <label>Payer</label>
                     <input type="text" placeholder="Enter your name" />
                  </div>

                  <div className="payment-form-group">
                     <label>Amount</label>
                     <input type="text" placeholder="Enter the amount" />
                  </div>
               </div>

               <button className="payment-form-submit-btn">Add Now</button>
            </div>
         </div>
      </div>
   );
};

export default CreatePayment;
