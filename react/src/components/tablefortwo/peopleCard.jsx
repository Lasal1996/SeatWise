import profilepic from '../../assets/defaultProfile.png';
import React, { useState , useEffect } from "react";

export default function Cards({ user }) {
  const [showModal, setShowModal] = useState(false);
  const [profilePic, setProfilePic] = useState(profilepic);

  useEffect(() => {
      const profilePicFilename = `../../assets/profile_${user.id}.jpg`;

      // Dynamically import the image
      import(profilePicFilename)
          .then(imageModule => {
              setProfilePic(imageModule.default); // Use the imported image
          })
          .catch(() => {
              setProfilePic(profilepic); // Fall back to default image if profile image not found
          });
  }, [user.id]);

  const handleImageError = () => {
      setProfilePic(profilepic); // Fall back to default image if profile image not found
  };
        return (
          
    <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
                     <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-3xl bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                     <img
                        src={profilePic}
                        alt="Profile"
                        onError={handleImageError}
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                    />       
                                </div>
              <div className='text-center'>
                <h3 className="mt-4 text-lg font-bold text-gray-700">{user.name}</h3>
                <h3 className="mt-4 text-m text-gray-700">{user.jobStatus}</h3>
                  <div className="flex items-center gap-2 mt-2 ml-20 text-sm text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <h3 className="text-center text-gray-700">{user.hometown}</h3>
                  </div>
                  
                
                {/* Buttons */}
                  <div className="mt-4">
                      <button onClick ={() => setShowModal(true)} className="block w-full py-2 bg-black text-white rounded-md shadow-md hover:bg-gray-900">Request</button>
                      <button className="block w-full py-2 mt-2 bg-white text-black border border-gray-300 rounded-md shadow-md hover:bg-gray-100">Remove</button>
                  </div>
              </div>
        </div>    
      
      {/* Modal View */}
      {showModal ? (
                  <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="py-8 px-16 border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex flex-col md:flex-row">
                  <img src={profilepic} className="mt-5 h-24 w-24 rounded-lg"/>
                  <div className="mx-10 w-full md:w-2/3 p-4">
                    <div className="items-center md:text-left">
                      <div className='gap-px'>
                        <div className="text-neutral-950 text-lg font-semibold mb-1">{user.name}</div>
                        {/* <div className="text-stone-300 text-xs font-normal mb-1">Level 23</div> */}
                      </div>
                      <div className="text-green-400 text-sm font-normal mb-1">88% match</div>
                      <div className="text-gray-400 text-sm mt-6 font-normal ">{user.jobStatus}</div>
                      <div className="flex ">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <h3 className="text-center text-gray-400 mb-4 ">{user.hometown}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-slate-500 text-xs font-normal">Lu-lana Nugegoda</div>
                    </div>
                    <div className="text-slate-500 text-xs font-normal mb-1">Thu 14 July</div>
                    <div className="text-slate-500 text-xs font-normal mb-2">6.00pm - 7.00pm</div>
                  </div>
                </div>
                <div className="flex items-center justify-end px-6 pt-6 pb-2 border-t border-solid border-slate-200 rounded-b">
                  <div className="w-full py-2 bg-neutral-950 rounded-md shadow-md text-center text-white text-base font-semibold">
                    Request
                  </div>
                </div>
                <div className="flex items-center justify-end px-6 pb-12 rounded-b">
                    <button onClick={() => setShowModal(false)} className="w-full py-2 bg-zinc-100 bg-opacity-75 rounded-md shadow-md text-center text-neutral-600 text-base font-semibold">
                      Cancel
                    </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}        
    </div>
  )
  }