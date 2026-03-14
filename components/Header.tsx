'use client'

import { motion } from 'framer-motion'
import { Play, Settings, Bell, Terminal } from 'lucide-react'

const Header = () => {
    return (
        <header id="portfolio-header">
            <div className="header-left">
                {/* <div className="header-logo">
                    <Terminal />
                </div> */}
                <motion.h2 
                    layoutId="shared-title"
                    className="header-title" 
                    style={{ 
                        color: 'goldenrod', 
                        textShadow: '0 0 10px rgba(218, 165, 32, 0.3)'
                    }}
                >
                    Satya Sanatan's Portfolio
                </motion.h2>
                    <div className="header-nav">
                        <a href="#">File</a>
                    <a href="#">Edit</a>
                    <a href="#">View</a>
                    <a href="#">Run</a>
                </div>
            </div>
            <div className="header-right">
                <div className="run-build-btn">
                    <Play className="play-icon" />
                    <span>Run Build</span>
                </div>
                <div className="header-buttons">
                    <button className="header-btn">
                        <Settings />
                    </button>
                    <button className="header-btn">
                        <Bell />
                    </button>
                </div>
            </div>
        </header>
    )
}

export default Header