/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    colors:{
      'dark-colors':{
        "login":{
          "primary-bg":"#3b5d7a" ,
          "secondry-bg":"#1f2f3e",
          "third-bg":"#15202b",
        },
        "dashboard":{
          "primary-bg":"#15202b" ,
          "secondry-bg":"#1f2f3e",
          "third-bg":"#22424f",
          "forth-bg" :"#1a2a39"
        },
        "text":"white"
      },
      'light-colors':{
        "login":{
          "primary-bg":"#f3fcfb" ,
          "secondry-bg":"#ffffff",
          "third-bg":"#f3fbfb",
          },
        "dashboard":{
          "primary-bg":"#f8f8f8" ,
          "secondry-bg":"#ffffff",
          "third-bg":"#e6f7f7",
          "forth-bg":"#1f2f3e"
        },
        "text":"black"
      },
      "primary":"#51c9c9",
      "btns-colors":{
          "primary" : "#35bfbf",
          "secondry" :"#ff6150"
      },



      
      // "pr-dark":'#1f2f3e' ,
      // "sec-dark" : '#35bfbf',
      // "pr-dark-2":"#3b5d7a" ,
      // "third-dark" : "#15202b" ,
    } ,
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),

  ],
}

