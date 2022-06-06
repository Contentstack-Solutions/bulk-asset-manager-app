import React, { Component } from "react";

interface Props {
  resultsLog: string[];
}

class Results extends Component<Props> {
  componentDidMount() {
    console.log(this.props.resultsLog);
  }

  render() {
    return (
      <>
        <h2>Results</h2>
        {this.props.resultsLog.map((res: any) => (
          <p>
            {res.filename} - {res.uid}
          </p>
        ))}
      </>
    );
  }
}

export default Results;
