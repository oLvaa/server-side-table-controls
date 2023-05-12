import { useEffect, useState } from "react";
import { CustomerService } from "./CustomerService";

type Filter = {
  value: string;
  matchMode?: "contains" | "startsWith" | "endsWith" | "equals";
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
};

type Data = {
  totalRecords: number;
  [key: string]: any;
};

type UseServerSideTableControlsOptions = LazyState & {
  baseUrl: string;
};

type UseServerSideTableControlsReturn<T> = {
  loading: boolean;
  data: T | null;
  totalRecords: number;
  handleServerAction: (event: LazyState) => void;
} & LazyState;

export function useServerSideTableControls<T>(
  options: UseServerSideTableControlsOptions
): UseServerSideTableControlsReturn<T> {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setlazyState] = useState<LazyState>(options);

  const { first, rows, filters, sortField, sortOrder } = lazyState;

  useEffect(() => {
    loadLazyData();
  }, [lazyState]);

  const loadLazyData = () => {
    setLoading(true);
    const params = generatePayload(lazyState);

    fetch(options.baseUrl + "?" + new URLSearchParams(params))
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

  const handleServerAction = (event: LazyState) => {
    let emptyFilters = Object.values(event.filters).every(
      (item: Filter) =>
        item.value === undefined || item.value === null || item.value === ""
    );

    if (!emptyFilters) event.first = 0;

    setlazyState((prev: LazyState) => ({ ...prev, ...event }));
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

const generatePayload = (lazyState: LazyState) => {
  const { filters, sortOrder, first, rows, sortField } = lazyState;
  const payload: any = {
    first,
    rows,
  };

  if (sortOrder === 1 || sortOrder === -1) {
    const sort = sortOrder === 1 ? "ASC" : "DESC";
    if (sortField) {
      payload.sortField = sortField;
      payload.sortOrder = sort;
    }
  }

  for (const key in filters) {
    if (
      Object.prototype.hasOwnProperty.call(filters, key) &&
      filters[key].value
    ) {
      const matchMode = filters[key].matchMode || "contains";
      payload[`filter_${key}`] = filters[key].value;
      payload[`matchMode_${key}`] = matchMode;
    }
  }

  return payload;
};
