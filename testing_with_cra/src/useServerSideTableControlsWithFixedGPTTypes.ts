import { useEffect, useState } from "react";
import { CustomerService } from "./CustomerService";

type Filter = {
  value: string;
  matchMode?: string;
};

type Filters = {
  [key: string]: Filter;
};

type LazyState = {
  first: number;
  rows: number;
  filters: Filters;
  sortField?: string;
  sortOrder?: number;
  sortNames: {
    asc: string;
    desc: string;
  };
};

export function useServerSideTableControls(baseUrl: any, options: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setlazyState] = useState(options);

  const { first, rows, filters, sortField, sortOrder } = lazyState;

  useEffect(() => {
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);
    const params = generatePayload(lazyState);

    fetch(baseUrl + "?" + new URLSearchParams(params))
      .then((response) => response.json())
      .then((data) => {
        setTotalRecords(data.totalRecords);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        //@ts-ignore
        setData(CustomerService);
        console.error(error);
        setLoading(false);
      });
  };

  const handleServerAction = (event: any) => {
    let emptyFilters = Object.values(event.filters).every(
      (item: any) =>
        item.value === undefined || item.value === null || item.value === ""
    );

    if (!emptyFilters) event.first = 0;

    setlazyState((prev: any) => ({ ...prev, ...event }));
  };

  const generatePayload = (lazyState: any) => {
    const { filters, sortOrder, page, rows, sortNames, sortField } = lazyState;
    const payload: any = {
      page,
      size: rows,
    };

    if (sortOrder === 1 || sortOrder === -1) {
      const sort = sortOrder === 1 ? sortNames.asc : sortNames.desc;
      if (sortField) {
        payload.sort = `${sortField},${sort}`;
      }
    }

    for (const key in filters) {
      if (
        Object.prototype.hasOwnProperty.call(filters, key) &&
        filters[key].value
      ) {
        payload[key] = filters[key].value;
      }
    }

    return payload;
  };

  return {
    loading,
    data,
    totalRecords,
    handleServerAction,
    first,
    rows,
    sortField,
    sortOrder,
    filters,
  };
}
