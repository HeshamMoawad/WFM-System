export const getRandomColor = ()=> {
    // Generate a random number between 0 and 16777215 (hex value of FFFFFF)
    const randomNum = Math.floor(Math.random() * 16777215);
    
    // Convert the number to a hexadecimal string and pad it to ensure 6 characters
    const randomColor = '#' + randomNum.toString(16).padStart(6, '0');
    
    return randomColor;
}

export const DEFAULT_INPUT_STYLE = "outline-none px-4 rounded-lg border border-[gray] bg-light-colors-login-third-bg dark:border-[#374558] dark:bg-dark-colors-login-third-bg"