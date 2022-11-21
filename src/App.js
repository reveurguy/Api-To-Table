import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

import Table from "./Components/Table";
import "./App.css";
import Nav from "./Components/Navbar";

const Status = ({ values }) => {
  var badge
  if (values === "Active") {
    badge = <span className="active">{values}</span>
  }
  if (values === "Pending") {
    badge = <span className="pending">{values}</span>
  }
  if (values === "Blocked") {
    badge = <span className="blocked">{values}</span>
  }
  if (values === "Idle") {
    badge = <span className="idle">{values}</span>
  }
  return (
    <span>
      {badge}
    </span>
  );
};

function App() {
  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name"
      },
      {
        Header: "Status",
        accessor: "subscription.status",
        Cell: ({ cell: { value } }) => <Status values={value} />
      },
      {
        Header: "Gender",
        accessor: "gender",
        filter: 'includes'
      },
      {
        Header: "Credit Card Number",
        accessor: "credit_card.cc_number"
      },
      {
        Header: "Address",
        accessor: "address.combined"
      }
    ],
    []
  );

  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const result = await axios("https://random-data-api.com/api/users/random_user?size=100");
      for (let i = 0; i < result.data.length; i++) {
        result.data[i].name = result.data[i].first_name + " " + result.data[i].last_name;
        result.data[i].address.combined = result.data[i].address.state + ", " + result.data[i].address.country;
      }
      setData(result.data);
    })();
  }, []);

  return (
    <div>
      <Nav />
      <div className="App">
        <div className="box">
          <Table columns={columns} data={data} setData={setData} />
        </div>
      </div>
    </div>
  );
}

export default App
