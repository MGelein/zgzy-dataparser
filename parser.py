output = []

with open("./output/linking_orig.csv", "r", encoding='utf16') as f:
    for line in f:
        if not line or  len(line) < 1:
            continue
        line = line.replace('\n', '')
        if '@' not in line: continue
        parts = line.split(",")
        
        for i in range(len(parts)):
            from_part = parts[i]
            if len(from_part) < 1:
                continue
            for j in range(i + 1, len(parts)):
                to_part = parts[j]
                if len(to_part) < 1:
                    continue
                output.append("%s, %s\n" % (from_part, to_part))

with open("linking.csv", "w", encoding='utf16') as f:
    f.writelines(output)