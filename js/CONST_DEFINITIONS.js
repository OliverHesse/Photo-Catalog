const FOLDER_ID = '14BNBG1FBrAhz9r95GnrA_uoxLGFdv4FO';
const DRIVE_LINK = "https://drive.google.com/drive/u/0/folders/14BNBG1FBrAhz9r95GnrA_uoxLGFdv4FO"
const TestFileID = "11Q5PMbXKAvW3RX9kD67dyYTOMFIS6KD6"
const FileURL = "https://drive.google.com/thumbnail?id="
const FileExportData = "&export&sz=w1000"
const config_url = "https://oliverhesse.github.io/Photo-Catalog/config.json"
const data_folder_url = "https://oliverhesse.github.io/Photo-Catalog/data/"
const root_tag = "root"
let TAG_RELATIONSHIPS = {}
let TAG_IMG_RELATIONHIPS = {}
let DE_NESTED_TAG_IMG_RELATIONSHIP
let CONFIG_DETAILS = {}
let TAGGED_FILES = []
let TagFilterSettings = {"exclude":[],"include":[]}