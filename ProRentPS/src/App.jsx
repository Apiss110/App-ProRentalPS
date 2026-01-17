import { useState } from "react";
import PSList from "./components/PSLIST";
import RentalForm from "./components/RentalForm";
import ActiveRentals from "./components/ActiveRentals";

function App() {
  const [refresh, setRefresh] = useState(false);

  // fungsi buat refresh rental aktif tiap 10 detik
  const triggerRefresh = () => setRefresh((prev) => !prev);

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Rental PS</h1>
      <RentalForm onRent={triggerRefresh} />
      <ActiveRentals refresh={refresh} />
      <PSList />
    </div>
  );
}

export default App;
