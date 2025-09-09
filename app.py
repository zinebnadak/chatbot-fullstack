import streamlit as st
import requests

st.title("Business Chatbot")

question = st.text_input("Ask a question:")

if st.button("Send") and question:
    with st.spinner("Getting answer..."):
        response = requests.post("http://localhost:8000/ask", json={"question": question})
        if response.status_code == 200:
            answer = response.json().get("answer", "No answer found.")
            st.markdown(f"**Bot:** {answer}")
        else:
            st.error("Error getting response from backend.")
