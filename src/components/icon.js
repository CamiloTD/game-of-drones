export default (({ name, size, style = {} }) => (
    <img
        src={`https://png.icons8.com/color/${name}/400px`}
        style={size? { width: size, height: size, ...style } : style}
    />
))