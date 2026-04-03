
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Mobile menu functionality
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-nav-menu');
        const closeMobileMenuButton = document.getElementById('close-mobile-menu');

        function openMobileMenu() {
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenu.classList.add('translate-x-0');
        }

        function closeMobileMenu() {
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('-translate-x-full');
        }

        mobileMenuButton.addEventListener('click', openMobileMenu);
        closeMobileMenuButton.addEventListener('click', closeMobileMenu);
        
        // Handle contact form submission
        document.getElementById('send-button').addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the default button behavior

            const to = document.getElementById('to').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Construct the mailto link
            const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

            // Open the user's email client
            window.open(mailtoLink, '_blank');

            // Show a temporary success message
            const messageBox = document.getElementById('message-box');
            messageBox.classList.add('show');
            setTimeout(() => {
                messageBox.classList.remove('show');
            }, 3000); // Hide the message after 3 seconds
        });

    
        // The content of the webpage to be used for grounding the API
        const pageContent = `
            About Section: The portfolio belongs to an AI Engineer with a passion for computational analysis. The individual uses calm activities like forest bathing, watching anime, and adventuring to scenic waterfalls to optimize performance.

            Skills Section:
            - Cloud & Virtualization: Google Cloud Platform, DevOps, Kubernetes, Docker, Programming, Scripting.
            - Artificial Intelligence: Scikit-learn, TensorFlow, Keras, Matplotlib, Seaborn, Pandas, NumPy.
            - Databases: SQL (MySQL, MSSQL), NoSQL (MongoDB), Database Administration, Backup & Recovery.
            - Automation & Scripting: Python, PowerShell, Bash Scripting, Ansible, Terraform, CI/CD Pipelines.
            - Version Control: GitHub, Tracking and managing changes, Branching & Merging, Code Reviews.

            Projects Section:
            - Machine Learning: Developed predictive models that analyze largescale data, discover patterns, and forecast future trends by utilizing linear regression, random forest regression, and decision trees thus achieving >90% accuracy. Keywords: Supervised learning, Unsupervised learning, Reinforcement Learning. Link: https://www.kaggle.com/tashiib.
            - Natural Language Processing: Built a sentiment analysis tool to classify customer feedback (positive, negative, neutral). Keywords: NER, Sentiment Analysis, Text Classification. Link: https://www.kaggle.com/tashiib.
            - Pygames: Developed a 2D side-scrolling platformer game from scratch using the Pygame library in Python. Showcases skills in game logic, collision detection, and user interfaces. Keywords: Python, Pygame, Game Development. Link: https://www.kaggle.com/tashiib.
        `;
        
        // Main function to send the user's message and get a response
        async function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            // Display user message
            chatBody.appendChild(createMessageElement(userMessage, 'user'));
            chatInput.value = '';
            scrollToBottom();

            const loadingEl = showLoading();

            try {
                // Prepare the system prompt to ground the model
                const systemPrompt = `You are an AI assistant for a portfolio website. Your purpose is to answer user questions about the portfolio owner's skills, projects, and background. You must ONLY use the provided portfolio content to form your answers. Do NOT invent information or refer to topics outside of this content. If the user asks a question that cannot be answered with the provided content, respond with "I'm sorry, I can only answer questions based on the information provided on this portfolio." Do not break character. Do not mention that you have a set of provided content. Here is the content you must use:
                ${pageContent}`;

                const apiKey = "";
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: userMessage }] }],
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                    })
                });

                const result = await response.json();
                const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "An error occurred. Please try again.";

                removeLoading(loadingEl);

                const botMessageEl = createMessageElement(text, 'bot');
                chatBody.appendChild(botMessageEl);
                scrollToBottom();

            } catch (error) {
                console.error("Failed to fetch from Gemini API:", error);
                removeLoading(loadingEl);
                chatBody.appendChild(createMessageElement("I'm sorry, I am unable to connect right now. Please try again later.", 'bot'));
                scrollToBottom();
            }
        }

            // Initialize theme on load
            document.addEventListener('DOMContentLoaded', () => {
                createTwinklingStars();
            });

        function formatAboutText() {

        const container = document.getElementById("about-text");

        const sentences = container.innerText
            .split("\n")
            .filter(line => line.trim() !== "");

        container.innerHTML = "";

        sentences.forEach((sentence, index) => {

            const line = document.createElement("p");

            line.textContent = sentence;

            line.classList.add("about-line");

            line.style.marginBottom = "10px";

            // Funnel effect
            line.style.marginLeft = `${index * 20}px`;

            container.appendChild(line);
        });
    }

        document.addEventListener("DOMContentLoaded", formatAboutText);
            


