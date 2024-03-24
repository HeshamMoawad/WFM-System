import * as FingerprintJS from 'fingerprintjs2';

export const getFingerprint = async () => {
    let clientId = ''
    await FingerprintJS.get({}, (components) => {
      // Use fingerprint as the client ID
      clientId = FingerprintJS.x64hash128(components.map((component) => component.value).join(), 31);
    });
    return clientId
  };

// const [id , setID] = useState<string>('')
// useEffect(() => {
//     // Generate client fingerprint
//     const getFingerprint = () => {
//       FingerprintJS.get({}, (components) => {
//         // Use fingerprint as the client ID
//         const visitorId = FingerprintJS.x64hash128(components.map((component) => component.value).join(), 31);
//         setID(visitorId);
//       });
//     };
//     getFingerprint();
//   }, []);

// import * as FingerprintJS from 'fingerprintjs2';

// export const getFingerprint = async () => {
//   const components = await FingerprintJS.get({});
//   const clientId = FingerprintJS.x64hash128(components.map((component) => component.value).join(), 31);
//   return clientId;
// };
