module agents {
    type Agent {
        required agent_id: int16 {constraint exclusive}; # 0-200 are reserved for Nations, 500 is World Agent, 600 is Journalist
        required private_key: str;
    }  
}