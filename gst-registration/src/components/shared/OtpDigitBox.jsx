export default function OtpDigitBox({ value, onChange, onKeyDown, onPaste, disabled, inputRef }) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      disabled={disabled}
      className="otp-box"
      style={{
        width:48, height:56, textAlign:"center", fontSize:22, fontWeight:800,
        fontFamily:"'JetBrains Mono',monospace",
        border:`2px solid ${disabled?"#BBF7D0":value?"#1B4FD8":"#CBD5E1"}`,
        borderRadius:10, outline:"none",
        background:disabled?"#F0FDF4":value?"#EEF4FF":"#fff",
        color:disabled?"#059669":value?"#1B4FD8":"#1E293B",
        transition:"all 0.15s ease",
        cursor:disabled?"not-allowed":"text",
        boxShadow:value&&!disabled?"0 0 0 3px rgba(27,79,216,0.12)":"none",
      }}
    />
  );
}
