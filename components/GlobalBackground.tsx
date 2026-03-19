import React from 'react'

const symbols = ['{ }', '< >', '/>', '(', ')', '#', '+', ':', ';', '[]', '&&', '||', '===']

const GlobalBackground = () => {
    return (
        <div className="global-bg-container" aria-hidden="true">
            <style>{`
                .global-bg-container {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: 0;
                    background-color: transparent;
                }

                /* Faint ambient glow for depth */
                .ambient-glow {
                    position: absolute;
                    width: 100vw; height: 100vh;
                    background: radial-gradient(circle at 50% 50%, rgba(6, 249, 249, 0.02) 0%, transparent 60%);
                    z-index: 0;
                }

                .bg-tech-symbol {
                    position: absolute;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 15px;
                    opacity: 0;
                    animation: float-symbol linear infinite;
                    color: rgba(6, 249, 249, 0.85); /* Cyan */
                    text-shadow: 0 0 8px rgba(6, 249, 249, 0.4); /* Neon Glow */
                    font-weight: 700;
                    user-select: none;
                    z-index: 1;
                }

                .bg-tech-symbol.purple {
                    color: rgba(139, 92, 246, 0.85);
                    text-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
                }

                .bg-tech-symbol.pink {
                    color: rgba(236, 72, 153, 0.85);
                    text-shadow: 0 0 8px rgba(236, 72, 153, 0.4);
                }
                
                .bg-tech-symbol.dim {
                    font-size: 12px;
                }

                .bg-tech-symbol.large {
                    font-size: 24px;
                }

                @keyframes float-symbol {
                    0%   { opacity: 0; transform: translateY(30px) rotate(0deg) scale(0.8); }
                    15%  { opacity: var(--max-opacity, 0.6); }
                    85%  { opacity: var(--max-opacity, 0.6); }
                    100% { opacity: 0; transform: translateY(-80px) rotate(var(--rot, 20deg)) scale(1.1); }
                }
            `}</style>

            <div className="ambient-glow" />
            
            {Array.from({ length: 50 }).map((_, i) => {
                const symbol = symbols[i % symbols.length]
                const isPurple = i % 3 === 0
                const isPink = i % 5 === 0
                const isDim = i % 2 === 0
                const isLarge = i % 7 === 0

                let className = 'bg-tech-symbol'
                if (isPurple) className += ' purple'
                else if (isPink) className += ' pink'
                
                if (isDim && !isLarge) className += ' dim'
                else if (isLarge) className += ' large'

                // Significantly increased visibility per the user's request
                const maxOpacity = isDim ? 0.35 : isLarge ? 0.25 : 0.7
                const rotation = (i % 2 === 0 ? 1 : -1) * (i * 1.5 + 15)

                return (
                    <span 
                        key={i} 
                        className={className} 
                        style={{
                            left: `${(i * 29 + 13) % 95}%`,
                            top: `${(i * 43 + 17) % 95}%`,
                            animationDelay: `${(i * 0.31).toFixed(2)}s`,
                            animationDuration: `${8 + (i % 6) * 2.5}s`,
                            '--max-opacity': maxOpacity,
                            '--rot': `${rotation}deg`,
                        } as React.CSSProperties}
                    >
                        {symbol}
                    </span>
                )
            })}
        </div>
    )
}

export default GlobalBackground
