import React from 'react';
import { useState, useEffect } from 'react';

function Search() {
    interface Member {
        name: string,
        member_id: number
    };

    interface Quotee {
        name: string,
        person_id: number
    }

    const [error, setError] = useState(null);
    const [loading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [quotees, setQuotees] = useState<Quotee[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetch('http://localhost:4000/members')
            .then(res => res.json())
            .then(res => setMembers(res));
        // have parameter for like top however many
        fetch('http://localhost:4000/quotees')
            .then(res => res.json())
            .then(res => setQuotees(res));
        // setMembers([{name: 'heemo 1', member_id: 1}, {name: 'heemo 2', member_id: 3}]);
    }, []);

    if (error) {
        return (
            <p>Error: {error}</p>
        )
    } else {
        return (
            <div className="search-wrapper">
                <input
                    type="search"
                    name="search-keyword"
                    id="search-keyword"
                    className="search-input"
                    value={query}
                    onChange={(e) => (setQuery(e.target.value))}
                    placeholder="keyword"
                />
                <label htmlFor="member-select">From member: </label>
                <select id="member-select" name="member-select" className="search-input" defaultValue="">
                    <option value="" key="default"></option>
                    {members.map((member: Member) => {
                        return <option value={member.member_id} key={member.member_id}>{member.name}</option>
                    })}
                </select>
                {/* no wait this should be a like type search with dropdown type thing? I think the from member should also do that */}
                <select id="quotee-select" name="quotee-select" className="search-input" defaultValue="">
                    <option value="" key="default"></option>
                    {quotees.map((quotee: Quotee) => {
                        return <option value={quotee.person_id} key={quotee.person_id}>{quotee.name}</option>
                    })}
                </select>
            </div>
        )
    }
    
}

export default Search;