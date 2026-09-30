'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState, useRef } from 'react';

export default function ChatPage() {
  const chatProps = useChat({
    onError: (error) => {
      alert("Erro na comunicação com a API: " + error.message);
    }
  });
  
  const { messages, status } = chatProps;
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Faz o scroll automático para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, status]);

  const enviarFormulario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    if (chatProps.sendMessage) {
      chatProps.sendMessage({ role: 'user', content: input } as any);
    }
    setInput('');
  };

  useEffect(() => {
    const ultimaMensagem = messages[messages.length - 1];
    if (!ultimaMensagem) return;

    const textoMensagem = (ultimaMensagem as any)?.content || (ultimaMensagem?.parts ? ultimaMensagem.parts.map((p: any) => p.type === 'text' ? p.text : '').join('') : '');

    if (ultimaMensagem.role === 'assistant' && textoMensagem.includes('[FIM_TRIAGEM]')) {
      const resumo = textoMensagem.split('[FIM_TRIAGEM]')[1]?.trim();
      if (resumo) {
        const numeroWhatsApp = '5534997957168'; // Número definido anteriormente
        const textoFormatado = encodeURIComponent(`Olá! Nova triagem finalizada:\n\n${resumo}`);
        const linkWhatsapp = `https://wa.me/${numeroWhatsApp}?text=${textoFormatado}`;
        window.location.href = linkWhatsapp;
      }
    }
  }, [messages]);

  const isTyping = status === 'submitted' || status === 'streaming';

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 font-sans">
      
      {/* Header Premium */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">Clínica Odontológica</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <p className="text-xs font-medium text-green-600">Assistente Online</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Área de Mensagens */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"/><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"/></svg>
              </div>
              <p className="text-gray-500 font-medium">Envie um "Olá" para iniciar seu atendimento.</p>
            </div>
          )}
          
          {messages.map(m => {
            const messageText = (m as any).content || (m.parts ? m.parts.map((p: any) => p.type === 'text' ? p.text : '').join('') : '');
            if (!messageText) return null;

            const isUser = m.role === 'user';
            const displayMessage = messageText.includes('[FIM_TRIAGEM]') 
              ? messageText.split('[FIM_TRIAGEM]')[0].trim() 
              : messageText.trim();

            return (
              <div key={m.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm ${isUser ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-blue-600'}`}>
                    {isUser ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                    isUser 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-tr-sm' 
                      : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
                  }`}>
                    <span className="whitespace-pre-wrap">{displayMessage}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Indicador de Digitação */}
          {isTyping && (
            <div className="flex w-full justify-start animate-fade-in-up">
              <div className="flex gap-3 max-w-[85%] sm:max-w-[75%] flex-row">
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-white border border-gray-200 text-blue-600 flex items-center justify-center mt-1 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </main>

      {/* Input Form */}
      <footer className="bg-white border-t border-gray-200 p-4 pb-6 sm:pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={enviarFormulario} className="flex items-end gap-2 relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder="Digite sua mensagem aqui..."
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 px-5 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[-1px] translate-y-[1px]"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-gray-400">Suas informações são tratadas com sigilo profissional.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
