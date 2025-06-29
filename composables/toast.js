import Swal from "sweetalert2";

export const sendError = (title) => {
    Swal.fire({
        title,
        toast:true,
        position:"top-right",
        showConfirmButton:false,
        icon:"error",
        timer:3000,
        timerProgressBar:true
    });
};
