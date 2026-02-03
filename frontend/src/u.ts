const CLOUDINARY_API_KEY = '233516748631711';
const CLOUDINARY_CLOUD_NAME = "dkbe7c8we";
export interface TFile {
    public_id: string,
    url: string,
    name: string,
}
export const uploadImageToCloudinary = async (image: File, onProgress?: (progress: number)=>void, public_id?: string): Promise<TFile> => {
    //const signatureResult = await getCloudinarySignature()
    
    const formData = new FormData();

    formData.append('file', image);
    //formData.append('upload_preset', "ml_default");
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("upload_preset", "danimern")
    const request = new XMLHttpRequest();
    request.upload.addEventListener("progress", (e)=>{
        console.log("progress", e.loaded, e.total, e.loaded/e.total * 100);
        if(onProgress)onProgress(e.loaded / e.total * 100);
    })
    request.open("post", `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
    request.send(formData);
    const p:TFile =  await new Promise((resolve, rejecct) =>{
         request.addEventListener("loadend", (e)=>{

            if(onProgress) onProgress(100);
         //-- console.log("loadend", request.response);
            resolve( JSON.parse(request.response));
        })
    })
    

    return p;
};