import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MaterialReactTable } from 'material-react-table';
import {
  Button,
  MenuItem,
  TextField,
  ListItemIcon
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { availability } from './availability';
import {CreateNewAccountModal} from './CreateNewAccountModal'

export const Table = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);

  useEffect(() => {
    if (!tableData.length) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    const localStorageData = localStorage.getItem('cars');

    if (localStorageData) {
      const parsedData = JSON.parse(localStorageData);
      setTableData(parsedData);
      setIsLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API}/api/cars/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error while fetching data');
        }
        return response.json();
      })
      .then((data) => {
        const processedData = data.cars.map((car) => ({
          ...car,
          availability: car.availability ? 'Yes' : 'No',
        }));
        setTableData(processedData);
        setIsLoading(false);
        localStorage.setItem('cars', JSON.stringify(processedData));
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsError(true);
      });
  }, []);

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
      tableData[row.index] = values;
      setTableData([...tableData]);
      localStorage.setItem('cars', JSON.stringify(tableData));
      exitEditingMode();
  };

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
    localStorage.setItem('cars', JSON.stringify(tableData));
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue('car_model')}?`)
      ) {
        return;
      }
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
      localStorage.setItem('cars', JSON.stringify(tableData));
    },
    [tableData],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'car',
        header: 'Company',
        enableEditing: false,
      },
      {
        accessorKey: 'car_color',
        header: 'Color',
      },
      {
        accessorKey: 'price',
        header: 'Price',
      },
      {
        accessorKey: 'car_model',
        header: 'Model',
        enableEditing: false,
      },
      {
        accessorKey: 'car_model_year',
        header: 'Year',
        enableEditing: false,
      },
      {
        accessorKey: 'car_vin',
        header: 'VIN',
        enableEditing: false,
      },
      {
        accessorKey: 'availability',
        header: 'Availability',
        muiTableBodyCellEditTextFieldProps: {
          select: true,
          children: availability.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          )),
        },
      },
    ],
    [],
  );

  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode='modal'
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        muiToolbarAlertBannerProps={
          isError
            ? {
              color: 'error',
              children: 'Error loading data',
            }
            : undefined
        }
        state={{
          isLoading,
          showAlertBanner: isError,
          showProgressBars: isRefetching,
        }}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={1}
            onClick={() => {
              handleDeleteRow(row)
              closeMenu();
            }}
            sx={{ m: 0 }}
          >
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            Delete
          </MenuItem>
        ]}
        renderTopToolbarCustomActions={() => (
          <Button
            color='secondary'
            onClick={() => setCreateModalOpen(true)}
            variant='contained'
          >
            ADD NEW CAR
          </Button>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
};
