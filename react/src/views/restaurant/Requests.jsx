import SideBar from "../../components/restaurant/SideBar";

export default function Requests() {
    return (
        <>
        <div className="main">
                
    
                <div className="ordercontainer">
                    <div className="menuContainer">
                        <SideBar />
                    </div>
                    <div className="contentContainer">
                        <div>
                            <header className="bg-white shadow">
                                <div className="flex mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Special Requests</h1>
                                    <div className="loading-container">
                                        {/* {loading && <p className="loading-text">Loading...</p>} */}
                                    </div>
                                </div>
                            </header>
                        </div>
                        <div className="flex mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            
                        </div>
                        
                    </div>
                </div>
    
                
    
                {/* <Footer /> */}
            </div>
        </>
      )
}
