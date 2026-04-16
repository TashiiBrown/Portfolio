function buildKnowledgeBase() {

knowledgeBase = [

{
category: "education history",
text: "Tashii Brown holds a Bachelors degree in Chemistry from The College of New Jersey and a Master of Science in Chemistry from the University of North Carolina."
},

{
category: "work history",
text: `- Public Communication Associate for the University of North Carolina
        Laboratory Safety Protocol Coordinator for the University of North Carolina
        Research Lab Associate University of North Carolina
        Graduate Teaching Assistant (General Chemistry II) University of North Carolina
        Amplitude Operation Specialist Thermo Fisher Scientific
        Student Supervisor Sodexo, The College of New Jersey
        Pharmaceutical Technician CVS
        Merchandising Associate Crate and Barrel
        Sales Intern Greater Newark Conservancy
        `,
},

{
category: "skills",
text: `- Cloud & Virtualization - Google Cloud Platform, DevOps, Kubernetes, Docker, and Programming, Scripting
        Artificial Intelligence - Scikit-learn, TensorFlow, Keras, Matplotlib, Seaborn, Pandas, NumPy
        Databases - SQL (MySQL, MSSQL), NoSQL (MongoDB), Database Administration, Backup & Recovery
        Automation & Scripting - Python, PowerShell, Bash Scripting, Ansible, Terraform, CI/CD Pipelines
        Version Control - GitHub, Branching & Merging, Code Reviews
        `,
},

{
category: "AI projects",
text: "Using machine learning and natural language processing to develop models that identify patterns, enabling accurate predictions, automating text analysis, and improving customer engagement. "
},

{
category: "Current",
text: "UI/UX Design, DNS Management, React.js."
},


];

}

let chatHistory = [];


let aiReady = false;

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
const menuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-nav-menu");
if(menuButton && mobileMenu){
    menuButton.addEventListener("click", () => {
        if(mobileMenu.classList.contains("-translate-y-full")){
            mobileMenu.classList.remove("-translate-y-full");
            mobileMenu.classList.add("translate-y-0");
        } 
        else{
            mobileMenu.classList.remove("translate-y-0");
            mobileMenu.classList.add("-translate-y-full");
        }
    });
    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("translate-y-0");
            mobileMenu.classList.add("-translate-y-full");
        });
    });

}})


document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-button");
    if(sendButton){
        sendButton.addEventListener("click", (e) => {
            e.preventDefault();
            const to = document.getElementById("to").value;
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value;
            const mailtoLink =
                `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            window.open(mailtoLink, "_blank");
            const messageBox = document.getElementById("message-box");
            if(messageBox){
                messageBox.classList.add("show");
                setTimeout(() => {
                    messageBox.classList.remove("show");
                }, 3000);
            }
        });
    }
});


function createGlobalStarfield(){
    const canvas = document.getElementById("global-starfield");
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [];
    const starCount = 700;
    function resizeCanvas(){
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function createStars(){
        stars = [];
        for(let i=0;i<starCount;i++){
            stars.push({
                x: Math.random()*canvas.width,
                y: Math.random()*canvas.height,
                radius: Math.random()*1.4,
                speed: Math.random()*0.3 + 0.05,
                opacity: Math.random()
            });
        }
    }

    createStars();

    function drawStars(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        stars.forEach(star=>{
            ctx.beginPath();
            ctx.arc(star.x,star.y,star.radius,0,Math.PI*2);
            ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
            ctx.fill();
        });
    }

    function updateStars(){
        stars.forEach(star=>{
            star.y += star.speed;
            if(star.y > canvas.height){
                star.y = 0;
                star.x = Math.random()*canvas.width;
            }
        });
    }

    function animate(){
        drawStars();
        updateStars();
        requestAnimationFrame(animate);
    }
    animate();
}


document.addEventListener("DOMContentLoaded",createGlobalStarfield);


function createStarfield() {
    const canvas = document.getElementById("stars");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let stars = [];
    const starCount = 300;
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    function createStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5,
                speed: Math.random() * 0.3 + 0.05
            });
        }
    }

    createStars();
    function drawStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function updateStars() {
        stars.forEach(star => {
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        });
    }

    function animate() {
        drawStars();
        updateStars();
        requestAnimationFrame(animate);
    }
    animate();
}


document.addEventListener("DOMContentLoaded", createStarfield);


let embedder;
let resumeEmbeddings=[];
let resumeChunks=[];

async function initAI(){

try{

console.log("Loading AI model...");

embedder = await window.transformers.pipeline(
"feature-extraction",
"Xenova/all-MiniLM-L6-v2"
);

console.log("Model loaded");

await prepareKnowledgeEmbeddings();

aiReady = true;

console.log("AI Ready");

}catch(err){

console.error("AI failed to initialize:", err);

}

}


async function prepareKnowledgeEmbeddings(){

buildKnowledgeBase();

// ✅ ONLY pass text, not whole object
const embeddings = await Promise.all(
    knowledgeBase.map(item =>
        embedder(item.text, { pooling: "mean", normalize: true })
    )
);

resumeEmbeddings = knowledgeBase.map((item, i) => ({
    text: item.text,
    category: item.category,
    vector: embeddings[i].data
}));

console.log("Knowledge base ready");

}


function detectIntent(query){

query = query.toLowerCase();

// ✅ match EXACT category names

if(query.includes("education") || query.includes("degree") || query.includes("school")){
    return "education history";
}

if(query.includes("work") || query.includes("job") || query.includes("experience")){
    return "work history";
}


if(query.includes("skill")){
    return "skills";
}

if(intent !== "general"){
    filtered = resumeEmbeddings.filter(item => item.category === intent);
    
    if(filtered.length === 0){
        return null;
    }
}

return "general";

}

document.addEventListener("DOMContentLoaded",initAI);


function cosineSimilarity(a,b){

let dot=0;
let normA=0;
let normB=0;

for(let i=0;i<a.length;i++){

dot+=a[i]*b[i];
normA+=a[i]*a[i];
normB+=b[i]*b[i];

}

return dot/(Math.sqrt(normA)*Math.sqrt(normB));

}


let chatIcon;
let chatWindow;
let sendBtn;
let input;
let messages;

document.addEventListener("DOMContentLoaded", () => {

const orb = document.getElementById("ai-orb");
const chat = document.getElementById("ai-chat-window");
sendBtn = document.getElementById("chat-send");
input = document.getElementById("chat-question");
messages = document.getElementById("ai-chat-messages");

orb.onclick = () => {
    chat.classList.toggle("active");
    orb.classList.toggle("orb-open");
};

sendBtn.onclick = askQuestion;

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        askQuestion();
    }
});

});


function addMessage(text,type){

const msg=document.createElement("div");

msg.className=`ai-message ${type}`;

msg.innerText=text;

messages.appendChild(msg);

messages.scrollTop=messages.scrollHeight;

}


function typeMessage(text){

const msg=document.createElement("div");

msg.className="ai-message ai-bot";

messages.appendChild(msg);

let i=0;

function type(){

if(i<text.length){

msg.innerHTML+=text.charAt(i);

i++;

setTimeout(type,18);

}

messages.scrollTop=messages.scrollHeight;

}

type();

}

async function semanticSearch(query){

const intent = detectIntent(query);

const qEmbed = await embedder(query,{pooling:"mean",normalize:true});

let filtered = resumeEmbeddings;

if(intent !== "general"){
    filtered = resumeEmbeddings.filter(item => item.category === intent);
}

let scores = [];

filtered.forEach(chunk => {
    scores.push({
        text: chunk.text,
        score: cosineSimilarity(qEmbed.data, chunk.vector)
    });
});

scores.sort((a,b)=>b.score-a.score);

// 🎯 RELEVANCE CHECK
const TOP_SCORE = scores[0]?.score || 0;

// threshold (tune this if needed)
const THRESHOLD = 0.20;

if(TOP_SCORE < THRESHOLD){
    return null; // ❌ not relevant
}

// return best matches
return scores.slice(0,2).map(s=>s.text);

}


async function askQuestion(){

if(!aiReady){
    typeMessage("Still initializing AI... give me a second 🚀");
    return;
}

const q = input.value.trim();
if(!q) return;

addMessage(q,"ai-user");
input.value="";

typeMessage("Thinking...");

const context = await semanticSearch(q);

// remove "Thinking..."
messages.lastChild.remove();

if(!context){
    typeMessage("That information is not provided and cannot be answered. Please contact Tashii via email to answer your question. Thank you");
    return;
}

const response = context.join("\n\n");

typeMessage(response);

}


let scrollTimer;

window.addEventListener("scroll",()=>{

const orb=document.getElementById("ai-orb");

if(!orb) return;

orb.style.opacity="0";

clearTimeout(scrollTimer);

scrollTimer=setTimeout(()=>{

orb.style.opacity="1";

},600);

});