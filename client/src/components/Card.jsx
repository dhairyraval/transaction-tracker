// import React from 'react'

const Card = ({ title, data }) => {
    return <div className="card bg-primary text-primary-content w-48">
        <div className="card-body items-center text-center">
            <h2 className="card-title">{title}</h2>
            <p>{data}</p>
        </div>
    </div>
}

export default Card