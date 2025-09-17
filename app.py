import streamlit as st
import requests

st.set_page_config(page_title="Business Chatbot")

st.title("💬 Business Chatbot")

# Session state to store chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for msg in st.session_state.messages:
    st.markdown(f"**{msg['role'].capitalize()}:** {msg['content']}")

# Input box
question = st.text_input("Ask a question:")

# On send
if st.button("Send") and question:
    # Add user message to history
    st.session_state.messages.append({"role": "user", "content": question})

    # Call backend
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

        # Add assistant message to history
        st.session_state.messages.append({"role": "bot", "content": answer})

        # Rerun to update chat display
        st.rerun()
