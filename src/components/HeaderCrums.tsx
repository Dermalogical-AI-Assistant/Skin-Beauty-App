import React from "react";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { MdArrowForwardIos } from "react-icons/md";

const HeaderCrums: React.FC = () => {
  const location = useLocation(); // 👈 hook này thay window.location
  const paths = location.pathname.split('/').filter(p => p);

  const breadcrumbs: { title: string; link: string }[] = paths.map((p, index) => ({
    title: p,
    link: `/${paths.slice(0, index + 1).join('/')}`
  }));

  return (
    <Breadcrumbs
      aria-label='breadcrumb'
      separator={<MdArrowForwardIos size={14} />}
    >
      <div className={`bg-pink-light w-2 h-2 p-3 rounded-md`}></div>
      {breadcrumbs.map((b, index) =>
        index !== breadcrumbs.length - 1 ? (
          <Box key={b.title}>
            <Link  className={`text-primary-dark/70 hover:text-primary-dark`} to={b.link}>
              {b.title}
            </Link>
          </Box>
        ) : (
          <Typography key={b.title} className={`text-primary-dark/90 font-bold`}>
            {b.title}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
};

export default HeaderCrums;
