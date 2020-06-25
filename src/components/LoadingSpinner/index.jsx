import React, { Component } from 'react'

export default class LoadingSpinner extends Component {
    render() {
        return (
            <div className="d-flex w-100 flex-row justify-content-center align-items-center">
                <div className="spinner-grow text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
}
