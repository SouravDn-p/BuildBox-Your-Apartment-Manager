import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import ApartmentCard from "./ApartmentCard";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const ApartmentList = ({ apartments }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rentRange, setRentRange] = useState({ min: 0, max: 10000 });

  const itemsPerPage = 6;

  const filteredApartments = apartments.filter(
    (apartment) =>
      apartment.rent >= rentRange.min && apartment.rent <= rentRange.max
  );

  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage);
  const paginatedApartments = filteredApartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const [text] = useTypewriter({
    words: ["Now!", "Today!", "Tomorrow!", "Repeat!"],
    loop: true,
    typeSpeed: 70,
  });
  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          marginBottom: 4,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <TextField
          type="number"
          label="Min Rent"
          value={rentRange.min}
          onChange={(e) =>
            setRentRange({ ...rentRange, min: Number(e.target.value) })
          }
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            minWidth: "120px",
            maxWidth: "220px",
            backgroundColor: "#f7f7f7",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            "& .MuiInputBase-root": {
              padding: "10px",
            },
          }}
        />
        <TextField
          type="number"
          label="Max Rent"
          value={rentRange.max}
          onChange={(e) =>
            setRentRange({ ...rentRange, max: Number(e.target.value) })
          }
          variant="outlined"
          size="small"
          sx={{
            flex: 1,
            minWidth: "120px",
            maxWidth: "220px",
            backgroundColor: "#f7f7f7",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            "& .MuiInputBase-root": {
              padding: "10px",
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCurrentPage(1)}
          sx={{
            minWidth: "180px",
            padding: "12px 20px",
            backgroundColor: "#6200ea",
            borderRadius: "12px",
            textTransform: "none",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              backgroundColor: "#3700b3",
            },
            transition: "background-color 0.3s ease",
          }}
        >
          Search
        </Button>
      </Box>

      <div>
        <h1
          className="text-4xl font-bold text-center pt-4"
          style={{ color: "white", fontWeight: "bold" }}
        >
          Book Apartment 
          <span className="text-red-500 "> {text}</span>
          <span>
            <Cursor cursorStyle="|" />
          </span>
        </h1>
      </div>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Showing {paginatedApartments.length} Apartments
      </Typography>

      <Grid container spacing={3}>
        {paginatedApartments.map((apartment) => (
          <Grid item xs={12} sm={6} md={4} key={apartment.id}>
            <ApartmentCard key={apartment.id} apartment={apartment} />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: 4,
        }}
      >
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Box>
  );
};

export default ApartmentList;
