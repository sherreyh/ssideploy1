import {
  Button,
  Divider,
  FormControl,
  Chip,
  Select,
  InputLabel,
  MenuItem,
  Table,
  Checkbox,
  OutlinedInput,
  ListItemText,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TextField,
  TableRow,
  Box,
  LinearProgress,
  Typography,
  TableSortLabel,
  InputAdornment,
  Skeleton,
  Alert,
  IconButton,
  Dialog,
  Popover,
  ListItemButton,
  List,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Slide,
} from "@mui/material";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const FiltersWithData = ({
  filterBrand,
  filterCategory,
  handleFilterBrand,
  handleFilterCategory,
  brandMenu,
  categoryMenu,
  specific,
}) => {
  return (
    <>
      {specific == "all" || !specific || specific == "brand" ? (
        <FormControl sx={{ m: 1, width: 300, zIndex: 0 }}>
          <InputLabel id="filter-sector-label">Brand</InputLabel>
          <Select
            labelId="filter-brand-label"
            id="filter-brand-select"
            multiple
            value={filterBrand}
            onChange={handleFilterBrand}
            input={<OutlinedInput label="Brand" />}
            renderValue={(selected) =>
              selected
                .map((x) => {
                  const srchIdx = brandMenu.findIndex((y) => y.id == x);
                  return brandMenu[srchIdx].name;
                })
                .join(", ")
            }
            MenuProps={MenuProps}>
            {brandMenu.map((x) => (
              <MenuItem key={`filter${x.name}`} value={x.id}>
                <Checkbox checked={filterBrand.indexOf(x.name) > -1} />
                <ListItemText primary={x.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <></>
      )}
      {specific == "all" || !specific || specific == "category" ? (
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="filter-sector-label">Category</InputLabel>
          <Select
            labelId="filter-category-label"
            id="filter-category-select"
            multiple
            value={filterCategory}
            onChange={handleFilterCategory}
            input={<OutlinedInput label="Category" />}
            renderValue={(selected) =>
              selected
                .map((x) => {
                  const srchIdx = categoryMenu.findIndex((y) => y.id == x);
                  return categoryMenu[srchIdx].name;
                })
                .join(", ")
            }
            MenuProps={MenuProps}>
            {categoryMenu.map((x) => (
              <MenuItem key={`filter${x.name}`} value={x.id}>
                <Checkbox checked={filterCategory.indexOf(x.name) > -1} />
                <ListItemText primary={x.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : (
        <></>
      )}
    </>
  );
};
