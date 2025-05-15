import UserHeader from "../../layouts/BaseLayout/Header";
import React, { useState } from "react";
import ProductItem from "./ProductItem.tsx";
import { Link, useSearchParams } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Chip, FormControl, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { PRODUCTS } from "../../constants/routes.ts";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import { SkincareConcern } from "../../types/SkincareConcern.ts";


const ProductsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = React.useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [selectedSkincareConcerns, setSelectedSkincareConcerns] = useState<string[]>([]);

  const [searchParams] = useSearchParams();
  const title = searchParams.get("pageTitle");

  const data ={
    "meta":{
      total:3960
    },
    "data": [{
      "id":"shdfkjshdfkjsdhk",
      "title": "LANEIGE Glaze Craze Tinted Lip Serum Exclusive - Maple Glaze 12g",
      "thumbnail": "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/15438179-1425237507334870.jpg&format=webp&auto=avif&width=640&height=640&fit=crop",
      "additional_images": [
        "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/15438179-1425237507334870.jpg&format=webp&auto=avif&width=640&height=640&fit=crop",
        "https://www.lookfantastic.com/images?url=https://static.thcdn.com/productimg/original/15438179-1425237507334870.jpg&format=webp&auto=avif&width=640&height=640&fit=crop"
      ],
      "price": 25.00,
      "currency": "USD",
      "avgRating": 4.7,
      "sold": 27,
      "descriptions": "LANEIGE Glaze Craze Tinted Lip Serum offers a juicy burst of color with deep hydration. Infused with a blend of shea butter and vitamin C, this tinted lip serum gives lips a healthy, glossy look while nourishing them throughout the day. The exclusive 'Maple Glaze' shade delivers a warm, reddish-brown tint perfect for autumn looks. Smooth texture, non-sticky finish, and perfect for everyday wear.",
      "how_to_use": "Apply directly onto clean lips using the built-in applicator. For a more intense color payoff, layer the product or use it over a lip liner. Can be used alone for a natural shine or over lipstick for added hydration and gloss.",
      "ingredient_benefits": "Infused with shea butter for deep moisturization, vitamin C to help brighten the lips' natural tone, and a blend of oils for a glossy, non-sticky finish. This formula is also free from parabens and mineral oils.",
      "full_ingredients_list": "Hydrogenated Polyisobutene, Diisostearyl Malate, Octyldodecanol, Polybutene, Dextrin Palmitate, Silica Dimethyl Silylate, Butyrospermum Parkii (Shea) Butter, Tocopheryl Acetate, Citrus Aurantium Dulcis (Orange) Oil, Fragrance, Ascorbyl Tetraisopalmitate, Caprylic/Capric Triglyceride, Red 7 Lake (CI 15850), Iron Oxides (CI 77491).",
      "skincare_concerns": [
        "Dry Lips",
        "Dullness"
      ],
      "createdAt": "2025-04-20T09:39:32.412Z"
    }]
  }
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
                    to={`${PRODUCTS}?pageTitle=${item.label}&&skincare_concern=${item.value}`}
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
            <span className={`text-primary-dark underline pr-3`}> {data.meta.total} Items</span>

            <TextField
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                onChange={ (event => {
                  setSelectedSkincareConcerns(event.target.value as string[])
                })}
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
                onChange={(event) => setFilter(event.target.value)}
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

        {/*Product*/}
        <div className="flex items-center justify-center px-32">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
            <ProductItem item={data.data[0]} />
          </div>
        </div>
        <div className={`flex items-center justify-center py-5 text-primary-dark/70 gap-10`}>
          <button
            className={`w-10 h-10 ${page===1?"cursor-not-allowed text-primary-dark/20":" cursor-pointer hover:bg-white/60"} flex items-center justify-center drop-shadow-lg   rounded-full`}
          ><MdOutlineNavigateBefore size={32}/></button>
          <span>Page {page} of {Math.ceil(data.meta.total / 10)}</span>
          <button className={`w-10 h-10  flex items-center justify-center drop-shadow-lg hover:bg-white/60 cursor-pointer  rounded-full`}><MdOutlineNavigateNext size={32}/></button>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;