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
      "wa-colors":{
        "background":"#ece5dd",
        "colors":{
            "primary" : "#25d366",
            "secondry" :"#075e54"
        },
      },



      
      // "pr-dark":'#1f2f3e' ,
      // "sec-dark" : '#35bfbf',
      // "pr-dark-2":"#3b5d7a" ,
      // "third-dark" : "#15202b" ,
    } ,
    extend: {
      transitionTimingFunction: {
        'new': 'cubic-bezier(0.01, 0.7, 0.1, 1)',
        'ease-out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'ease-in-out-expo': 'cubic-bezier(1, 0, 0, 1)',
      },
      
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    
  ],
}

