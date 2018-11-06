import { fetchPopularRepos } from '../api'
import React, { Component } from 'react'

export default class RepoGrid extends Component {
    constructor(props){
        super(props)
        let repos

        if ( __isBrowser__ ) {
            repos = window.__INITIAL_DATA__
            delete window.__INITIAL_DATA__
        } else {
            repos = props.staticContext.data
        }

        this.state = {
            repos,
            loading: repos ? false : true
        }

        this.fetchRepos = this.fetchRepos.bind(this)
    }

    componentDidMount () {
        if (!this.state.repos) {
            this.fetchRepos(this.props.match.params.id)
        }
    }

    componentDidUpdate (prevProps) {
        if (prevProps.match.params.id !== this.props.match.params.id) {
            this.fetchRepos(this.props.match.params.id)
        }
    }

    fetchRepos (lang) {
        this.setState( () => ({
            loading: true
        }) )

        fetchPopularRepos(lang)
            .then( repos => this.setState( () => ({
                repos,
                loading: false,
            }) ) )
    }

    render() {
        const { repos, loading } = this.state

        if (loading) {
            return <p> Loading... </p>
        } else {
            return (
                <ul style={{display: 'flex', flexWrap: 'wrap'}}>
                    { repos.map( ({ name, owner, stargazers_count, html_url }) => (
                        <li key={name} style={ {margin: 30} }>
                            <ul>
                                <li> <a href={html_url}> {name} </a> </li>
                                <li> @{owner.login} </li>
                                <li> {stargazers_count} stars </li>
                            </ul>
                        </li>
                    ) ) }
                </ul>
            )
        }
    }
}