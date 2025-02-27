const API_KEY = "AIzaSyCLGzd-Qm_toEeVi4j-lbhP99hY29ODOs4";
const FOLDER_ID = '14BNBG1FBrAhz9r95GnrA_uoxLGFdv4FO';
const DRIVE_LINK = "https://drive.google.com/drive/u/0/folders/14BNBG1FBrAhz9r95GnrA_uoxLGFdv4FO"
const TestFileID = "11Q5PMbXKAvW3RX9kD67dyYTOMFIS6KD6"
const FileURL = `https://drive.google.com/thumbnail?id=11Q5PMbXKAvW3RX9kD67dyYTOMFIS6KD6`




async function testGetFiles(){
    //https://www.googleapis.com/drive/v3/files?q='14BNBG1FBrAhz9r95GnrA_uoxLGFdv4FO'+in+parents&key=AIzaSyCLGzd-Qm_toEeVi4j-lbhP99hY29ODOs4
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&key=${API_KEY}`)
    const data = await response.json();
    console.log(data)

}

