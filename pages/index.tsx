import { Chat } from "@/components/Chat/Chat";
import { Footer } from "@/components/Layout/Footer";
import { Navbar } from "@/components/Layout/Navbar";
import { Message } from "@/types";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message: Message) => {
    const updatedMessages = [...messages, message];

    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("https://a6f0-2400-adc5-168-fc00-318c-6612-4e5a-d372.ngrok-free.app/whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        msg: message.content,
        from:"Faisal"
      })
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const data = response.body;

    if (!data) {
      return;
    }

    setLoading(false);

    const data2 =await response.json()
    console.log(data2.response)

    setMessages((messages) => [
      ...messages,
      {
        role: "assistant",
        content: data2.response
      }
    ]);

    // const reader = data.getReader();
    // const decoder = new TextDecoder();
    // let done = false;
    // let isFirst = true;

    // while (!done) {
    //   const { value, done: doneReading } = await reader.read();
    //   done = doneReading;
    //   const chunkValue = decoder.decode(value);

    //   if (isFirst) {
    //     isFirst = false;
    //     setMessages((messages) => [
    //       ...messages,
    //       {
    //         role: "assistant",
    //         content: chunkValue
    //       }
    //     ]);
    //   } else {
    //     setMessages((messages) => {
    //       const lastMessage = messages[messages.length - 1];
    //       const updatedMessage = {
    //         ...lastMessage,
    //         content: lastMessage.content + chunkValue
    //       };
    //       return [...messages.slice(0, -1), updatedMessage];
    //     });
    //   }
    // }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! 👋 I'm June 🔥, an AI assistant. You can store your information by prefixing your message with train: and then your statement, or you can ask me questions you like.`
      }
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Hi there! I'm June, an AI assistant. You can store your information by prefixing your message with train: and then your statement, or you can ask me questions you like.`
      }
    ]);
  }, []);

  return (
    <>
      <Head>
        <title>Hi , June here 🫡</title>
        <meta
          name="description"
          content="A simple chatbot starter kit for OpenAI's chat model using Next.js, TypeScript, and Tailwind CSS."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </Head>

      <div className="flex flex-col h-screen">
        <Navbar />

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSend={handleSend}
              onReset={handleReset}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
