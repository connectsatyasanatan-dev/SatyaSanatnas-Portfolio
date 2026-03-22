import React from 'react'

const symbols = ['{ }', '< >', '/>', '(', ')', '#', '+', ':', ';', '[]', '&&', '||', '===']

const GlobalBackground = () => {
    return (
        <div className="global-bg-container" aria-hidden="true">
            <style>{`
                .global-bg-container {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    overflow: hidden;
                    z-index: -1;
                    background-color: #000000ff;
                }

                .bg-tech-symbol {
                    position: absolute;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 15px;
                    opacity: 0;
                    animation: float-symbol linear infinite;
                    color: var(--primary); 
                    text-shadow: 0 0 8px var(--primary-glow);
                    font-weight: 700;
                    user-select: none;
                }

                .bg-tech-symbol.purple {
                    color: rgba(139, 92, 246, 0.9);
                }

                .bg-tech-symbol.pink {
                    color: rgba(236, 72, 153, 0.9);
                }
                
                .bg-tech-symbol.dim {
                    font-size: 12px;
                }

                .bg-tech-symbol.large {
                    font-size: 32px;
                }

                @keyframes float-symbol {
                    0%   { opacity: 0; transform: translateY(100px) rotate(0deg) scale(0.9); }
                    15%  { opacity: var(--max-opacity, 0.6); }
                    85%  { opacity: var(--max-opacity, 0.6); }
                    100% { opacity: 0; transform: translateY(-300px) rotate(var(--rot, 20deg)) scale(1.1); }
                }
            `}</style>

            {Array.from({ length: 40 }).map((_, i) => {
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

                const maxOpacity = isDim ? 0.3 : isLarge ? 0.2 : 0.5
                const rotation = (i % 2 === 0 ? 1 : -1) * (i * 1.5 + 15)

                return (
                    <span 
                        key={i} 
                        className={className} 
                        style={{
                            left: `${(i * 37 + 13) % 95}%`,
                            top: `${(i * 19 + 7) % 95}%`,
                            animationDelay: `${(i * 0.43).toFixed(2)}s`,
                            animationDuration: `${12 + (i % 8) * 3}s`,
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
