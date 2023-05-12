import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useServerSideTableControls } from "./useServerSideTableControlsWithFixedGPTTypes";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
const representativeBodyTemplate = (rowData) => {
  return (
    <div className="flex align-items-center gap-2">
      <img
        alt={rowData.representative.name}
        src={`https://primefaces.org/cdn/primereact/images/avatar/${rowData.representative.image}`}
        width={32}
      />
      <span>{rowData.representative.name}</span>
    </div>
  );
};

const countryBodyTemplate = (rowData) => {
  return (
    <div className="flex align-items-center gap-2">
      <img
        alt="flag"
        src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
        className={`flag flag-${rowData.country.code}`}
        style={{ width: "24px" }}
      />
      <span>{rowData.country.name}</span>
    </div>
  );
};
function App() {
  const {
    loading,
    data,
    totalRecords,
    handleServerAction,
    first,
    rows,
    sortField,
    sortOrder,
    filters,
  } = useServerSideTableControls("/vp/api/v1/daoMaster/product", {
    first: 0,
    rows: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    filters: {
      name: { value: "", matchMode: "contains" },
      "country.name": { value: "", matchMode: "contains" },
      company: { value: "", matchMode: "contains" },
      "representative.name": { value: "", matchMode: "contains" },
    },
    sortNames: {
      asc: "asc",
      desc: "desc",
    },
  });

  return (
    <div className="card">
      <DataTable
        value={data}
        lazy
        filterDisplay="row"
        dataKey="id"
        paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        sortField={sortField}
        sortOrder={sortOrder}
        filters={filters}
        onPage={handleServerAction}
        onSort={handleServerAction}
        onFilter={handleServerAction}
        loading={loading}
        tableStyle={{ minWidth: "75rem" }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column
          field="name"
          header="Name"
          sortable
          filter
          filterPlaceholder="Search"
        />
        <Column
          field="country.name"
          sortable
          header="Country"
          filterField="country.name"
          body={countryBodyTemplate}
          filter
          filterPlaceholder="Search"
        />
        <Column
          field="company"
          sortable
          filter
          header="Company"
          filterPlaceholder="Search"
        />
        <Column
          field="representative.name"
          header="Representative"
          body={representativeBodyTemplate}
          filter
          filterPlaceholder="Search"
        />
      </DataTable>
    </div>
  );
}

export default App;
