const Footer = () => {
    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    return (
        <div style={footerStyle}>
            <br/>
            <em>React notes app. Author: Javon Jackson</em>
        </div>
    )
}

export default Footer