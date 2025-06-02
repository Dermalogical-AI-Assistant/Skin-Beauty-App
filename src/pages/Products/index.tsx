import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem.tsx";
import { Link, useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import { Chip, FormControl, InputLabel, OutlinedInput } from "@mui/material";
import { ROUTE_PRODUCTS } from "../../constants/routes.ts";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { SkincareConcern } from "../../types/SkincareConcern.ts";
import useProducts from "../../hooks/useProducts.ts";
import { GetProductRequestParam } from "../../types/Products.ts";
import Loading from "../../components/Loading";
import { UrlParams } from "../../types/common.ts";

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get all params from URL with defaults
  const title = searchParams.get("pageTitle") || "";
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "createdAt:desc";
  const page = parseInt(searchParams.get("page") || "0");
  const pageSize = parseInt(searchParams.get("pageSize") || "20");
  const skincareConcernsParam = searchParams.get("skincareConcerns") || "";
  const selectedSkincareConcerns = skincareConcernsParam ? skincareConcernsParam.split(',') : [];

  // State for the search input field with debounce
  const [inputValue, setInputValue] = useState(search);
  const [timer, setTimer] = useState<number | undefined>();

  // Update URL when any parameter changes
  const updateUrlParams = (newParams:UrlParams) => {
    const updatedParams = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "" || value === null || (Array.isArray(value) && value.length === 0)) {
        updatedParams.delete(key);
      } else if (Array.isArray(value)) {
        updatedParams.set(key, value.join(','));
      } else {
        updatedParams.set(key, value?.toString() || "");
      }
    });

    setSearchParams(updatedParams);
  };

  const inputChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      updateUrlParams({ search: newValue });
    }, 500);

    setTimer(newTimer);
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    updateUrlParams({ filter: event.target.value });
  };
  const handleSkincareConcernsChange = (event: SelectChangeEvent<typeof selectedSkincareConcerns>) => {
    const {
      target: { value },
    } = event;
    // value có thể là string hoặc string[], tùy mode multiple, nên ép kiểu nếu cần
    const newValues = typeof value === 'string' ? value.split(',') : value;
    updateUrlParams({ skincareConcerns: newValues });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 0 || (data && newPage > (Math.ceil((data.meta?.total || 0) / pageSize))-1)) {
      return;
    }
    updateUrlParams({ page: newPage.toString()  });
  };

  const { getProducts } = useProducts();

  const productParams: GetProductRequestParam = {
    search: search,
    page: page,
    perPage: pageSize,
    order: filter,
    skincareConcerns: selectedSkincareConcerns
  };

  const { data, isLoading } = getProducts(productParams);

  useEffect(() => {
    setInputValue(search);
  }, []);

  return (
    <div className={`bg-primary relative flex min-h-screen flex-col`}
         key={title}
    >
      <div>
        {/*Header*/}
        <div className={`flex justify-center py-5`}>
          <h1 className={`font-playfair text-primary-dark text-5xl font-bold`}>
            {title}
          </h1>
        </div>

        {/*Skincare Concern*/}
        <section className={`flex flex-col items-center justify-center`}>
          <div className={`border-primary-dark/20 w-1/2 border`}></div>
          <div className={`my-3 flex flex-col items-center justify-center`}>
            <h2 className={`text-primary-dark/70 p-4 text-2xl font-bold`}>
              All Skincare Concerns
            </h2>
            <div className="flex h-full w-full flex-wrap justify-center py-2">
              {
                SkincareConcern.getAll().map((item, index) => (
                  <Link
                    to={`${ROUTE_PRODUCTS}?pageTitle=${item.label}&skincareConcerns=${item.value}`}
                    key={index}
                    className="bg-pink-light/70 mx-2 my-1 rounded-full p-3 font-bold text-nowrap text-white"
                  >
                    {item.label}
                  </Link>
                ))}
            </div>
          </div>
          <div className={`border-primary-dark/20 w-1/2 border`}></div>
        </section>

        {/*Filter*/}
        <div
          className={`sticky top-20 z-100 my-5 px-40 flex flex-col items-end justify-between bg-white/10 p-3 drop-shadow backdrop-blur-xs `}
        >
          <div className={`flex items-center justify-end`}>
            <span className={`text-primary-dark underline pr-3`}> {data?.meta.total} Items</span>

            <TextField
              label="Search"
              value={inputValue}
              onChange={(e) => inputChanged(e)}
              size="small"
              className="rounded-full"
              sx={{
                "& label.Mui-focused": {
                  color: "var(--color-primary-dark)",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-primary-dark)",
                  },
                },
              }}
            />

            <FormControl
              size={"small"}
              sx={{
                m: 1,
                minWidth: 300,
                "& label.Mui-focused": {
                  color: "var(--color-primary-dark)",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary-dark)",
                  },
                },
              }}>
              <InputLabel id="demo-multiple-chip-label">Skincare Concerns</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={selectedSkincareConcerns}
                onChange={handleSkincareConcernsChange}
                input={<OutlinedInput id="select-multiple-chip" label="Skincare Concerns" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {SkincareConcern.getAll().map((item) => (
                  <MenuItem
                    key={item.value}
                    value={item.value}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size={"small"}
              sx={{
                m: 1,
                minWidth: 120,
                "& label.Mui-focused": {
                  color: "var(--color-primary-dark)",
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "var(--color-primary-dark)",
                  },
                },
              }}
            >
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter}
                label="Filter"
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"createdAt:desc"}>Newest Arrivals</MenuItem>
                <MenuItem value={"title:asc"}>A-Z</MenuItem>
                <MenuItem value={"title:desc"}>Z-A</MenuItem>
                <MenuItem value={"price:asc"}>Price:Low to High</MenuItem>
                <MenuItem value={"price:desc"}>Price:High to Low</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        {
          isLoading ?
            <Loading entityName="products"></Loading>
            :
            <>
              {/*Product*/}
                <div className="flex items-center justify-center px-32">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {data?.data.map((item, index) => (
                      <Link
                        to={`${ROUTE_PRODUCTS}/${item.id}`}
                        key={index}
                        className="flex-shrink-0 my-3 transition-transform hover:scale-105 duration-300 cursor-pointer"
                      >
                        <ProductItem item={item} />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className={`flex items-center justify-center py-5 text-primary-dark/70 gap-10 my-7`}>
                  <button
                    className={`w-10 h-10 ${page===0?"cursor-not-allowed text-primary-dark/20":" cursor-pointer hover:bg-white/60"} flex items-center justify-center drop-shadow-lg rounded-full`}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                  >
                    <MdOutlineNavigateBefore size={32}/>
                  </button>

                  <span>
                    {
                      data?.meta?.total === 0 ?
                        `No items found`
                        :
                        `Page ${page+1} of ${Math.ceil((data?.meta?.total ?? 0) / pageSize)}`
                    }

                  </span>
                  <button
                    className={`${page >= Math.ceil((data?.meta?.total ?? 0) / pageSize)-1?"cursor-not-allowed text-primary-dark/20":" cursor-pointer hover:bg-white/60" } w-10 h-10 flex items-center justify-center drop-shadow-lg rounded-full`}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= Math.ceil((data?.meta?.total ?? 0) / pageSize)-1}
                  >
                    <MdOutlineNavigateNext size={32}/>
                  </button>
                </div>
            </>
        }
      </div>
    </div>
  );
}

export default ProductsPage;