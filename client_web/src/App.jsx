import { useState } from "react";
import Login from "./login";
import SignUp from "./SignUp";
import img from "./assets/img.png";
import icon from "./assets/icon.png";

function App() {
  const [isSignUp, setIsSignUp] = useState(false);

  // const handleRegisterClick = () => {
  //   setIsSignUp(true);
  // };

  return (
    <div className="bg-indigo-500 ">
      <div className="min-h-screen  flex items-center justify-center p-4 rounded-3xl ">
        <div className=" h-100 bg-white rounded-3xl shadow-xl max-w-4xl flex flex-col md:flex-row">
          {/* Left Side - Blue Section */}
          <div className=" relative min-h-scree bg-indigo-600 rounded-tl-3xl  rounded-bl-3xl  p-8 md:w-3/5 flex flex-col items-center justify-center text-white">
            <div className="w-10 h-10 absolute left-5 top-5 transform translate-x-[10%] translate-y-[10%]">
              <img
              src= {icon}>
              </img>
             
            </div>
            <div className="w-48 h-48 mb-6">
              <img
                src={img}
                alt="Welcome illustration"
                className="w-full h-full"
              />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-m">
              Welcome aboard my friend
            </h2>
            <p className="text-blue-200 text-center text-xs">
              just a couple of clicks and we start
            </p>
          </div>

          {/* Right Side - White Section */}

          <div className="p-8  w-[400px]">
            {isSignUp ? (
              <SignUp setIsSignUp={setIsSignUp} />
            ) : (
              <Login setIsSignUp={setIsSignUp} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
