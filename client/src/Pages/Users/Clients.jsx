import React, { useEffect, useState } from "react";
import Topbar from "./Topbar";
import { Table } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import { getClients, getEmployeeClients } from "../../redux/action/user";
import { Tooltip, Divider } from "@mui/material";
import { PiTrashLight, PiXLight, PiNotepad, PiPencilLight } from "react-icons/pi";
import Filter from "./Filter";
import DeleteClient from "./Delete";
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Clients = () => {
  const dispatch = useDispatch();
  const { clients, isFetching, error, loggedUser } = useSelector((state) => state.user);

  const columns = [
    {
      field: "uid",
      headerName: "ID",
      width: 70,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <Tooltip title={""}>
          <span className="font-primary capitalize">{params.row.uid}</span>
        </Tooltip>
      ),
    },
    {
      field: "Client Name",
      headerName: "Client Name",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="capitalize text-[#20aee3] font-primary hover:text-[#007bff] cursor-pointer font-light">
          {params.row.firstName} {params.row.lastName}
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Client Username",
      width: 200,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="capitalize font-primary">{params.row.username}</div>
      ),
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="font-primary">{params.row.phone}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="font-primary">{params.row.email}</div>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      headerClassName: "super-app-theme--header",
      renderCell: (params) => (
        <div className="flex gap-[10px]">
          {loggedUser?.role !== "employee" && (
            <>
              
              <Tooltip placement="top" title="Delete" arrow>
                <PiTrashLight
                  onClick={() => handleOpenDeleteModal(params.row._id)}
                  className="cursor-pointer text-red-500 text-[23px] hover:text-red-400"
                />
              </Tooltip>
              <Tooltip placement="top" title="Edit" arrow>
                <PiPencilLight
                  onClick={() => handleOpenEditModal(params.row)}
                  className="cursor-pointer text-green-500 text-[23px] hover:text-green-400"
                />
              </Tooltip>
            </>
          )}
        </div>
      ),
    },
  ];

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [openFilters, setOpenFilters] = useState(false);
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [clientForm, setClientForm] = useState({
    uid: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
  });
  const [editClientForm, setEditClientForm] = useState({
    _id: "",
    uid: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    uid: "",
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (loggedUser?.role === "employee") {
      dispatch(getEmployeeClients());
    } else {
      dispatch(getClients());
    }
  }, [dispatch, loggedUser]);

  const handleClickOpen = () => {
    setOpenClientModal(true);
  };

  const handleOpenDeleteModal = (userId) => {
    setSelectedUserId(userId);
    setOpenDeleteModal(true);
  };

  const handleOpenEditModal = (client) => {
    setEditClientForm({
      _id: client._id,
      uid: client.uid || "",
      firstName: client.firstName || "",
      lastName: client.lastName || "",
      username: client.username || "",
      phone: client.phone || "",
      email: client.email || "",
    });
    setOpenEditModal(true);
  };

  const handleClose = () => {
    setOpenClientModal(false);
    setOpenEditModal(false);
    setClientForm({
      uid: "",
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      email: "",
    });
    setEditClientForm({
      _id: "",
      uid: "",
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      email: "",
    });
    setErrors({
      uid: "",
      firstName: "",
      lastName: "",
      username: "",
      phone: "",
      email: "",
    });
  };

  const handleChange = (field, value, isEdit = false) => {
    const setForm = isEdit ? setEditClientForm : setClientForm;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = (form) => {
    const newErrors = {};
    let isValid = true;

    Object.keys(form).forEach((key) => {
      if (key !== "_id" && !form[key].trim()) {
        newErrors[key] = `${key === "firstName" ? "First Name" : key === "lastName" ? "Last Name" : key === "username" ? "Client Username" : key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      } else {
        newErrors[key] = "";
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (isEdit = false) => {
    const form = isEdit ? editClientForm : clientForm;
    if (validateForm(form)) {
      if (isEdit) {
        // Dispatch action to update client in backend
        console.log("Client Form Updated:", editClientForm);
      } else {
        // Dispatch action to add client to backend
        console.log("Client Form Submitted:", clientForm);
      }
      handleClose();
    }
  };

  return (
    <div className="w-full">
      <DeleteClient open={openDeleteModal} setOpen={setOpenDeleteModal} userId={selectedUserId} />
      <Filter open={openFilters} setOpen={setOpenFilters} />

      {/* Add Client Form Modal */}
      <Dialog
        scroll="paper"
        open={openClientModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Add New Client</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Client Details</span>
            </div>
            <Divider />
            <table className="mt-4 w-full">
              <tbody>
                <tr>
                  <td className="pb-4 text-lg">ID</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={clientForm.uid}
                      onChange={(e) => handleChange("uid", e.target.value)}
                      error={!!errors.uid}
                      helperText={errors.uid}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">First Name</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={clientForm.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Last Name</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={clientForm.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Client Username</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={clientForm.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      error={!!errors.username}
                      helperText={errors.username}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Phone</td>
                  <td className="pb-4">
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={clientForm.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Email</td>
                  <td className="pb-4">
                    <TextField
                      type="email"
                      size="small"
                      fullWidth
                      placeholder="Optional"
                      value={clientForm.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
          >
            {isFetching ? "Submitting..." : "Submit"}
          </button>
        </DialogActions>
      </Dialog>

      {/* Edit Client Form Modal */}
      <Dialog
        scroll="paper"
        open={openEditModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">Edit Client</div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>Client Details</span>
            </div>
            <Divider />
            <table className="mt-4 w-full">
              <tbody>
                <tr>
                  <td className="pb-4 text-lg">ID</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={editClientForm.uid}
                      onChange={(e) => handleChange("uid", e.target.value, true)}
                      error={!!errors.uid}
                      helperText={errors.uid}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">First Name</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={editClientForm.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value, true)}
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Last Name</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={editClientForm.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value, true)}
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Client Username</td>
                  <td className="pb-4">
                    <TextField
                      size="small"
                      fullWidth
                      value={editClientForm.username}
                      onChange={(e) => handleChange("username", e.target.value, true)}
                      error={!!errors.username}
                      helperText={errors.username}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Phone</td>
                  <td className="pb-4">
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={editClientForm.phone}
                      onChange={(e) => handleChange("phone", e.target.value, true)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="pb-4 text-lg">Email</td>
                  <td className="pb-4">
                    <TextField
                      type="email"
                      size="small"
                      fullWidth
                      placeholder="Optional"
                      value={editClientForm.email}
                      onChange={(e) => handleChange("email", e.target.value, true)}
                      error={!!errors.email}
                      helperText={errors.email}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(true)}
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
          >
            {isFetching ? "Saving..." : "Save"}
          </button>
        </DialogActions>
      </Dialog>

      <Topbar />

      {/* Add Client Button */}
      <div className="flex justify-end mb-4 pr-4">
        <button
          onClick={handleClickOpen}
          className="bg-primary-blue hover:bg-blue-500 text-white font-primary px-4 py-2 rounded-lg text-sm shadow-md transition-all"
        >
          + Add Client
        </button>
      </div>

      <Table
        rows={clients}
        columns={columns}
        isFetching={isFetching}
        error={error}
        rowsPerPage={10}
      />
    </div>
  );
};

export default Clients;