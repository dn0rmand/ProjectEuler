node --stack-size=8092 --max-old-space-size=12288 --prof $1
ISOLATE=`ls isolate*.log`
echo ${ISOLATE}
node --stack-size=8092 --max-old-space-size=12288 --prof-process ${ISOLATE} > profiler.txt
rm ${ISOLATE}
code profiler.txt
sleep 5
rm profiler.txt