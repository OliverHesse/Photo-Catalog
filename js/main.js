

function select_image(event){
    console.log(event)
    let e = event.target
    console.log(e)
    const offset = 0
    let link = e.src
    
    link = link.split("&sz=w")[0]
    link += `&sz=w${5200}`
    let selected_image_element = document.getElementsByClassName("selected-image")[0]

    selected_image_element.src = link
    
    let holder = document.getElementsByClassName("selected-image-holder")[0]
    holder.style.display = "flex";
    console.log(holder.offsetHeight)
    
    let width = holder.offsetWidth
    let new_height = holder.offsetHeight
    let new_width = e.naturalWidth*(new_height/e.naturalHeight)
    if(new_width > (width+offset)){
        new_width = width-offset
        new_height = e.naturalHeight*(new_width/e.naturalWidth)
    }
    
    console.log(new_height)
    console.log(new_width)

    selected_image_element.width = new_width
    selected_image_element.height = new_height


    

}


function close_selected(){
    if(document.fullscreenElement){closeFullscreen()}
    let container = document.getElementsByClassName("selected-image-holder")[0]
    document.getElementsByClassName("selected-image")[0].src = ""
    if(container.style.display == "flex"){container.style.display="none"}
    
}

let screen_state = "normal"

function full_screen_select(){
    console.log("changing screen state")
    let btn = document.getElementById("change_screen_state_img");
    if(screen_state == "normal"){
        screen_state = "fullscreen"
        btn.src = "assets/exit-fullscreen.svg"
        openFullscreen(document.getElementsByClassName("selected-image-holder")[0])
        recalculate_img_size()
    } else{
        
        screen_state = "normal"
        btn.src = "assets/expand-fullscreen.svg"
        closeFullscreen()
    }
}
document.getElementsByClassName("selected-image-holder")[0].addEventListener("fullscreenchange",(event) =>{
    if(document.fullscreenElement){return}
    let btn = document.getElementById("change_screen_state_img");
    screen_state="normal"    
    btn.src = "assets/expand-fullscreen.svg"
    closeFullscreen()
    recalculate_img_size()
})


function recalculate_img_size(){
    let selected_image_element = document.getElementsByClassName("selected-image")[0]
    let holder = document.getElementsByClassName("selected-image-holder")[0]
    console.log(screen.height)
    
    let width =screen.width;
    let new_height = screen.height
    let new_width = selected_image_element.naturalWidth*(new_height/selected_image_element.naturalHeight)
    if(new_width > (width)){
        new_width = width
        new_height = selected_image_element.naturalHeight*(new_width/selected_image_element.naturalWidth)
    }
    
    console.log(new_height)
    console.log(new_width)

    selected_image_element.width = new_width
    selected_image_element.height = new_height


}

function openFullscreen(elem) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
}
function closeFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }


function create_child_tag_array(parent_tag){
  let child_array = []
  for(const child of TAG_RELATIONSHIPS[parent_tag]["top-level-children"]){
    child_array += create_child_tag_array(child) + [child]
  }
  return child_array
}


function addNewTagFilter(tag,filter_type){
  if(filter_type == "normal"){
    TagFilterSettings["exclude"] =  TagFilterSettings["exclude"] .filter(item => item !== filter_type);
    TagFilterSettings["include"] =  TagFilterSettings["include"] .filter(item => item !== filter_type);
  }else if(filter_type == "exclude"){
    //find all children and remove
    child_list = create_child_tag_array(tag) + [tag];
    TagFilterSettings["include"] =  TagFilterSettings["include"] .filter(item => !(child_list.includes(item)));
    TagFilterSettings["exclude"] =  TagFilterSettings["exclude"] .filter(item => !(child_list.includes(item)));
    //find all children and remove
    TagFilterSettings["exclude"].push(tag)
  }else if(filter_type == "include"){
    //find all children and remove
    child_list = create_child_tag_array(tag) + [tag];
    TagFilterSettings["include"] =  TagFilterSettings["include"] .filter(item => !(child_list.includes(item)));
    TagFilterSettings["exclude"] =  TagFilterSettings["exclude"] .filter(item => !(child_list.includes(item)));
    //find all children and remove
    TagFilterSettings["include"].push(tag)
  }
}
//TODO implement
function open_tag_select(){}


let root_tag = "root"
function dive_tag(e){
  let root_title = getElementById("current-root-tag")
  //clear holder
  let container = document.getElementsByClassName("tag-container")[0]
  container.innerHTML = ""
  let tag = e.parent.childNodes[1].innerHTML
  root_title.innerHTML = tag
  let top_level_child_tags = TAG_RELATIONSHIPS[tag]["top-level-children"]
  //generate tag option
  for(const child_tag of top_level_child_tags){
    let tag_state = "normal"
    if(TagFilterSettings["exclude"].includes(child_tag)){tag_state="exclude"}
    if(TagFilterSettings["include"].includes(child_tag)){tag_state="include"}
    let html_text = `<div class="tag-option">
                    <img class = "tag-state-img normal"  onclick="change_tag_state(this)" style="cursor: pointer;" width="10px" height= "10px"src="assets/${tag_state}.svg">
                    <span class = "tag-span" onclick="change_tag_state(this)" style="cursor: pointer;user-select: none;">${child_tag}</span>
                    <button onclick="dive_tag(this)" class="dive-tag-btn"><img width="10px" height= "10px"src="assets/retrace-tag.svg" style="transform: rotate(90deg);"></button>
                </div>`
    container.innerHTML += html_text
  }
}

function change_tag_state(e){
  let tag = null
  if(e.classList.contains("tag-state-img")){
    let parent = e.parentNode;
    tag = parent.children[1].innerHTML;
  }else{
    //the span was clicked
    tag = e.innerHTML
    console.log( e.parentNode.children)
    e = e.parentNode.children[0]
  }

  if(e.classList.contains("normal")){
    //change to include
    addNewTagFilter(tag,"include");
    e.src = "assets/include.svg";
    e.classList.add("include")
    e.classList.remove("normal")

  }else if(e.classList.contains("include")){
    //change to exclude
    addNewTagFilter(tag,"exclude");
    e.src = "assets/exclude.svg";
    e.classList.remove("include")
    e.classList.add("exclude")

  }else if(e.classList.contains("exclude")){
    //change to normal
    addNewTagFilter(tag,"normal");
    e.src = "assets/normal.svg";
    e.classList.remove("exclude")
    e.classList.add("normal")
  }
}