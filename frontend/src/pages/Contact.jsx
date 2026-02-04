import { MessageCircle, Phone, Mail } from 'lucide-react';
import Footer from '../layout/Footer';

export default function Contact() {
  return (
    <div className="min-h-screen">
      {/* First Section - Hero */}
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            We're Here To Help
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Got any questions about the product or orders on our platform? We're here to help.
            Chat to our friendly team 24/7 and get onboard in less than 5 minutes.
          </p>
        </div>
      </div>

      {/* Second Section - Contact Details */}
      <div className="min-h-screen bg-[#B6865A] flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Where We Are
          </h2>
          
          <p className="text-lg text-white mb-12 leading-relaxed">
            Shed No.7 , Shyam Industrial Estate GIDC Industrial Area, Odhav , Ahmedabad, Gujarat -382415.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-4 text-white">
              <Phone className="w-6 h-6 flex-shrink-0" />
              <span className="text-lg font-medium">+91 9327058504</span>
            </div>

            <div className="flex items-center gap-4 text-white">
              <Mail className="w-6 h-6 flex-shrink-0" />
              <span className="text-lg font-medium">skichariz@gmail.com</span>
            </div>
          </div>

          <p className="text-lg text-white/90 mt-12 leading-relaxed">
            We're available from 9am - 6pm IST, Monday - Friday. Call or email us directly.
          </p>
        </div>
      </div>
    <Footer/>
    </div>
  );
}