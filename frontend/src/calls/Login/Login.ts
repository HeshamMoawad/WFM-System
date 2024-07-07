import { FormEvent } from "react";
import { TRANSLATIONS } from "../../utils/constants";
import { sendRequest } from "../../calls/base";
import { parseObject } from "../../utils/converter";
import Swal from "sweetalert2";
import { loadID, saveLogin } from "../../utils/storage";
import Authintication from "../../types/auth";
import { Language } from "../../types/base";
import { getFingerprint } from "../../utils/fingerprint";

export const onSubmitLoginForm = (
    e: FormEvent,
    lang: Language,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setAuth: React.Dispatch<React.SetStateAction<Authintication>>
) => {
    // e.preventDefault()
    setLoading(true);
    getFingerprint().then((fingerprint) => {
        sendRequest({
            url: "api/users/login",
            method: "POST",
            params: { unique_id: fingerprint, ...parseObject(e) },
            reloadWhenUnauthorized: false,
        })
            .then((data) => {
                setLoading(false);
                setAuth({...data,_password:null});
                saveLogin({...data,_password:null});
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: TRANSLATIONS.Login.Alerts.onSuccess[lang],
                    text: `${data?.username} & ${data?.title}`,
                    showConfirmButton: false,
                    timer: 1000,
                }).then(() => {
                    window.location.href = "/dashboard";
                });
            })
            .catch((err) => {
                Swal.fire({
                    icon: "error",
                    title: TRANSLATIONS.Login.Alerts.onFaild[lang],
                    text: "Please check your username and password \n or check your device id",
                    showConfirmButton: false,
                    timer: 1000,
                });
            })
            .finally(() => setLoading(false));
    });
};

export const onForgetPassword = (
    lang: Language,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    const form = new FormData();

    form.append("username", "");

    Swal.fire({
        icon: "info",
        title: TRANSLATIONS.Login.Alerts.onFaild[lang],
        input: "text",
        inputAttributes: {
            autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Send",
        showLoaderOnConfirm: true,
        preConfirm: async (username_) => {
            try {
                const data = await sendRequest({
                    url: "api/users/send_password",
                    method: "POST",
                    params: { username: username_ },
                });
                if (data) {
                    return Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Successfully sent password",
                        text: `${data.message}`,
                        showConfirmButton: false,
                        timer: 1200,
                    });
                }
            } catch (error) {
                Swal.showValidationMessage(`
                Request failed: ${error}
              `);
            }
        },
    }).then(() => {
        setLoading(false);
    });
};
