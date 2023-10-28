import { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";


export default function TableStructure() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [views, setViews] = useState([]);
//   const [tableId, setTableId] = useState(null);
  
  const [tableData, setTableData] = useState([]);

  const [errors, setErrors] = useState(null);
  const {user, setUser } = useStateContext();

  // New states to store the selected box coordinates
  const [selectedItemX, setselectedItemX] = useState(null);
  const [selectedItemY, setselectedItemY] = useState(null);

  const [loading, setLoading] = useState(false);

  const tablenoRef = useRef();
  const chairsRef = useRef();
  const viewidRef = useRef();
  const popupRef = useRef();

  // const [toggle, setToggle] = useState('tables');
  const [floor, setFloorData] = useState([]);
  const [toggle, setToggle] = useState([1]);
  const [selectedFloor, setSelectedFloor] = useState([1]);

  const handleToggle = (floorNumber) => {
    setSelectedFloor(floorNumber);
    setToggle(floorNumber);
  };

  function handleItemClick(itemNumber) {
    setIsModalOpen(true);
    setSelectedItem(itemNumber);

    let columnIndex;
    if (itemNumber % 11 === 0) {
      columnIndex = 11;
    } else {
      columnIndex = itemNumber % 11;
    }
    
    const rowIndex = Math.floor(itemNumber / 11);

    setselectedItemX(columnIndex);
    setselectedItemY(rowIndex);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }




  const onSubmitTable = (ev) => {
    ev.preventDefault();
    // const x = selectedItemX;
    // const y = selectedItemY;
    const payload = {
      restaurant_id: user.id,
      table_id: selectedItem,
      table_number: tablenoRef.current.value,
      floor: selectedFloor,
      number_of_chairs: chairsRef.current.value,
      view: viewidRef.current.value,
      posX: selectedItemX, 
      posY: selectedItemY,
    }
    // console.log(payload);
    setErrors(null)
    axiosClient.post('/table', payload)
    .then((response) => {
      console.log('API response:', response.data);
      handleCloseModal();
      window.location.reload();
    })
    .catch(err => {
			const response = err.response;
			if (response && response.status === 422) {
				if(response.data.errors)
				{
					setErrors(response.data.errors)
				}else{
					setErrors({
						email: [response.data.message]
					})
				}
			}
			})
  }



  useEffect(() => {
    axiosClient.get('/user')
    .then(({data}) => {
        setUser(data)
        getViews(data.id);
        fetchTableData(data.id);
        getfloordata(data.id);
    })
    }, [])

    const getViews = (restaurant_id) => {
        if (!restaurant_id) {
        console.error("Restaurant ID not available.");
        return;
        }
  
        const payload = {
        restaurant_id: restaurant_id,
        };
        
        axiosClient
        .get('/views', { params: payload })
        .then(({ data }) => {
            setViews(data);
        })
        .catch((error) => {
            console.error("Error fetching views:", error);
        });
    };

    const fetchTableData = (restaurant_id) => {
        setLoading(true);
        axiosClient
        .get("/gettable", { params: { restaurant_id } })
        .then(({ data }) => {
            // console.log("Fetched table data:", data);
            setTableData(data);
            setLoading(false)
        })
        .catch((error) => {
            console.error("Error fetching tables:", error);
        });
    };

    const getfloordata = (restaurant_id) => {
      axiosClient
      .get("/getfloor", { params: { restaurant_id } })
      .then(({ data }) => {
        if (data !== undefined) {
          setFloorData([data.floors]);
        } else {
          console.error("API response is missing expected data");
        }
      })
      .catch((error) => {
          console.error("Error fetching tables:", error);
      });
  };

    

    const isTableInStructure = (tableNumber) => {
        // const parsedTableNumber = parseInt(tableNumber, 10);
        return tableData.some((table) => (table.table_id) === String(tableNumber) && (table.floor) == selectedFloor);
      };

 
  

  

  


  return (
    <>
      <header className="bg-white shadow">
        <div className="flex mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Table Structure</h1>
          <div className="loading-container">
            {loading && <p className="loading-text">Loading...</p>}
          </div>
        </div>
      </header>

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
    
            <h1 className="text-1xl font-bold">Arrange your table Structure</h1>

              {/* <p>Select according to your restaurant table staructure</p>

              <p>Add table count with necessary details</p> */}



              <div>
                <div className="flex items-center justify-center mb-6">
                    {Array.from({ length: floor }, (_, index) => (
                      <div
                        key={index+1}
                        className={`py-2 px-4 rounded-lg ${
                          toggle === index + 1 ? 'bg-green-500 text-white' : 'bg-white text-green-500'
                        }`}
                        onClick={() => handleToggle(index + 1)}
                      >
                        Floor {index + 1}
                      </div>
                    ))}
                  
                </div>

                  <div className="grid-container">
                    {Array.from({ length: 44 }, (_, index) => {
                        const tableNumber = index + 1;
                        const isTablePresent = isTableInStructure(tableNumber);
                        // console.log(isTablePresent);
                        console.log(selectedFloor);
                        return (
                            <div
                            key={tableNumber}
                            className={`grid-item ${isTablePresent ? "bg-green-500" : "bg-gray-800"}`}
                            onClick={() => handleItemClick(tableNumber)}
                            >
                            {isTablePresent ? tableData.find((table) => table.table_id === String(tableNumber) && (table.floor) == selectedFloor).table_number : ""}
                            </div>
                        );
                    })}
                  </div>
              </div>
                
          
          

        

              {/* popup */}
              {isModalOpen && (
                <div ref={popupRef} className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="bg-white p-4 z-10 mt-10 sm:mx-auto sm:w-full sm:max-w-sm rounded-lg">
                      <h2>Popup Content for Item {selectedItem}</h2>
                      <h2 className="text-2xl font-bold">Create Table</h2>
                      <form onSubmit={onSubmitTable} className="space-y-4">
                        <label htmlFor="table-name" className="block text-sm font-medium leading-6 text-gray-900 mt-0">Table No:</label>
                        <input ref={tablenoRef} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" />
      
                        <label htmlFor="capacity" className="block text-sm font-medium leading-6 text-gray-900 mt-0">No of chairs:</label>
                        <input ref={chairsRef} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="number" />
      
                        <label htmlFor="capacity" className="block text-sm font-medium leading-6 text-gray-900 mt-0">Select view:</label>
                        <select ref={viewidRef} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text">
                        {views.map((view) => (
                            <option key={view.id} value={view.id}>
                              {view.name}
                            </option>
                          ))}
                        </select>
                        {/* Add more input fields as needed for other table data */}

                        {/* Store the selected box's coordinates */}
                        <input type="hidden" value={selectedFloor} />
                        <input type="hidden" value={selectedItemX} />
                        <input type="hidden" value={selectedItemY} />

                        <div className="flex space-x-4">
                        <button onClick={handleCloseModal} className="flex w-full justify-center rounded-md bg-white rounded-lg shadow border border border-gray-300 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm">Cancel</button>
                          <button type="submit" className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Create table</button>
                        </div>
                      </form>
                      
                    </div>
                </div>
              )}

              
          </div>
        </main>
    </>
  )
}




