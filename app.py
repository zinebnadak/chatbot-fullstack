import streamlit as st
import requests
from streamlit_chat import message  # Chat bubble component

# 🧠 Page config
st.set_page_config(page_title="💬 Business Chatbot", layout="centered")

# 💬 Page title
st.markdown("<h1 style='text-align: center;'>💬 Business Chatbot</h1>", unsafe_allow_html=True)

# 💅 Custom CSS for cleaner chat layout (inspired by Hugging Face)
st.markdown("""
    <style>
        /* Reduce padding around message bubbles */
        .stChatMessage {
            padding: 0.25rem 1rem;
        }

        /* Tweak font size and make bubble edges smoother */
        .stChatMessageContent {
            font-size: 1rem;
            border-radius: 0.75rem !important;
        }

        /* Center the input box and send button */
        .block-container {
            padding-top: 2rem;
            padding-bottom: 2rem;
        }

        /* Optional: Light background for app */
        body {
            background-color: #FAFAFA;
        }

        /* Make bot/user distinction clearer */
        .stChatMessage.user {
            background-color: #DCF8C6 !important;
        }

        .stChatMessage.bot {
            background-color: #F1F0F0 !important;
        }
    </style>
""", unsafe_allow_html=True)

# 📦 Store chat history in session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# 💬 Render message history
for msg in st.session_state.messages:
    message(msg["content"], is_user=(msg["role"] == "user"))

# 📝 Input field
question = st.text_input("Ask a question:", placeholder="Type your message here...")

# 🚀 Send button
if st.button("Send") and question:
    # Add user message
    st.session_state.messages.append({"role": "user", "content": question})

    # Talk to backend
    with st.spinner("Getting answer..."):
        try:
            response = requests.post(
                "https://nadak-s-ai-chatbot.onrender.com/ask",
                json={"question": question},
                timeout=30
            )
            response.raise_for_status()
            answer = response.json().get("answer", "No answer found.")
        except Exception as e:
            answer = f"⚠️ Error: {str(e)}"
            st.error(answer)

        # Add bot response
        st.session_state.messages.append({"role": "bot", "content": answer})

        # Rerun to update UI
        st.rerun()


